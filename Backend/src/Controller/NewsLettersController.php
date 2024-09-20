<?php

namespace App\Controller;

use App\Emails\EmailService;
use App\Entity\NewsLetters;
use App\Repository\NewsLettersRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class NewsLettersController extends AbstractController
{
    #[Route('/api/newsletter', name: 'app_news_letters', methods: ['POST'])]
    public function subscribe(Request $request, EntityManagerInterface $em, UserRepository $userRepository, NewsLettersRepository $newsLettersRepository, EmailService $emailService)
    {
        try {
            $data = json_decode($request->getContent(), true);

            $user = $userRepository->findOneBy(['email' => $data['email']]);
            $subscriber = $newsLettersRepository->findOneBy(['email' => $data['email']]);

            if ($user || $subscriber || empty($data["email"])) {
                return $this->json(['message' => "Email déja présent en base de donnée"], 403);
            }

            $newsLetter = new NewsLetters();
            $newsLetter->setEmail($data['email']);
            $newsLetter->setCreatedAt(new \DateTimeImmutable('now'));

            $em->persist($newsLetter);
            $em->flush();

            $emailService->sendEmail($data['email'], "Inscription à la newsletter", "emails/newsLetter.html.twig", []);

            return $this->json(['message' => "Email enregistrer dans la base de donner", 'status' => 200], 200);
        } catch (\Throwable $th) {
            return $this->json(['message' => "Erreur serveur", 'status' => 500], 500);
        }
    }
}
