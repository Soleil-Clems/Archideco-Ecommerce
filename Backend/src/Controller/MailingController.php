<?php

namespace App\Controller;

use App\Emails\EmailService;
use App\Entity\CodePromotion;
use App\Entity\User;
use App\Repository\UserRepository;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class MailingController extends AbstractController
{
    protected $emailService;
    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }
    #[Route('/api/send-promotion-code', name: 'app_send_promotion', methods: ['POST'])]
    #[IsGranted('ROLE_USER', message: "Vous n'êtes pas administrateur")]
    public function sendPromotion(Request $request, UserRepository $userRepository, EntityManagerInterface $em)
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (is_array($data['userId'])) {
                foreach ($data['userId'] as  $userId) {
                    $user = $userRepository->find($userId);
                    $codePromotion = new CodePromotion();
                    $codePromotion->setUserId($user);
                    $codePromotion->setValue($data['value']);
                    $codePromotion->setCode($data['code']);
                    $codePromotion->setCreatedAt(new DateTimeImmutable("now"));
                    $dateTime = new DateTimeImmutable($data['expiration']);
                    $codePromotion->setExpireAt($dateTime);
                    $em->persist($codePromotion);
                    $em->flush();
                    $this->emailService->sendEmail(
                        $user->getEmail(),
                        "L'équipe Achideco vous offre un code promotionel !",
                        "emails/promotionCode.html.twig",
                        [
                            "firstname" => $user->getFirstname(),
                            "lastname" => $user->getLastname(),
                            "value" => $data['value'],
                            "code" => $data['code'],
                            "expiration" => $data['expiration']
                        ]
                    );
                }
            } else {
                $user = $userRepository->find($data['userId']);
                $codePromotion = new CodePromotion();
                $codePromotion->setUserId($user);
                $codePromotion->setValue($data['value']);
                $codePromotion->setCode($data['code']);
                $codePromotion->setCreatedAt(new DateTimeImmutable("now"));
                $dateTime = new DateTimeImmutable($data['expiration']);
                $codePromotion->setExpireAt($dateTime);
                $em->persist($codePromotion);
                $em->flush();

                $this->emailService->sendEmail(
                    $user->getEmail(),
                    "L'équipe Achideco vous offre un code promotionel !",
                    "emails/promotionCode.html.twig",
                    [
                        "firstname" => $user->getFirstname(),
                        "lastname" => $user->getLastname(),
                        "value" => $data['value'],
                        "code" => $data['code'],
                        "expiration" => $data['expiration']
                    ]
                );
            }

            return $this->json(["message" => "Email envoyé"], 200);
        } catch (\Throwable $th) {
            return $this->json(["message" => "impossible d'envoyer l'email"], 404);
        }
    }

    #[Route('/reset-password-email', name: "app_reset_password", methods: ["POST"])]
    public function resetPasswordEmail(Request $request, UserRepository $userRepository)
    {
        try {
            $data = json_decode($request->getContent(), true);

            $user = $userRepository->findOneBy(["email" => $data["email"]]);

            if ($user instanceof User) {
                $this->emailService->sendEmail(
                    $user->getEmail(),
                    "Récupération de mot de passe",
                    "emails/resetPassword.html.twig",
                    [
                        "firstname" => $user->getFirstname(),
                        "lastname" => $user->getLastname(),
                        "token" => $user->getToken()
                    ]
                );
            } else {
                return $this->json(["message" => "Aucun utilisateur corespond avec l'email"], 403);
            }

            return $this->json(["message" => "Email envoyer"], 200);
        } catch (\Throwable $th) {
            return $this->json(["message" => "impossible d'envoyer l'email"], 404);
        }
    }
}
