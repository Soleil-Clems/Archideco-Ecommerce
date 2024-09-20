<?php

namespace App\Controller;

use App\Emails\EmailService;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class RegisterController extends AbstractController
{
    protected $EmailService;
    public function __construct(EmailService $EmailService)
    {
        $this->EmailService = $EmailService;
    }

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): JsonResponse
    {

        try {

            $data = json_decode($request->getContent(), true);


            if (empty($data['email']) || empty($data['password']) || empty($data['firstname']) || empty($data['lastname'])) {
                return $this->json(['message' => 'Tous les champs sont requis'], 403);
            }

            $emailExist = $userRepository->findOneBy(["email" => $data['email']]);

            if ($emailExist) {
                return $this->json(['message' => 'Email deja pris veuillez vous connecter'], 403);
            }

            $user = new User();
            $token = bin2hex(random_bytes(32));
            $user->setToken($token);
            $user->setEmail($data['email']);
            $user->setRoles(['ROLE_USER']);
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);
            $user->setFirstname($data['firstname']);
            $user->setLastname($data['lastname']);
            $user->setCreatedAt(new \DateTimeImmutable());
            $user->setUpdatedAt(new \DateTimeImmutable());
            $user->setVerified(false);
            $user->setPicture($data['picture'] ?? null);
            $user->setActif(true);

            $this->EmailService->sendEmail(
                $data['email'],
                "Bienvenue chez Archideco !",
                "emails/welcome.html.twig",
                [
                    "firstname" => $data["firstname"],
                    "lastname" => $data["lastname"],
                    "token" => $token
                ]
            );

            $entityManager->persist($user);
            $entityManager->flush();
        } catch (\Throwable $th) {
            return $this->json(['message' => "Erreur lors de l'inscription"], 500);
        }

        return $this->json(['message' => 'Utilisateur enregistré avec succès'], 200);
    }

    #[Route('/validate/{token}', name: 'validate_token', methods: ['GET'])]
    public function validateEmail($token, UserRepository $userRepository, EntityManagerInterface $em)
    {
        try {
            $user = $userRepository->findOneBy(['token' => $token]);

            if ($user) {
                $user->setVerified(true);
                $em->persist($user);
                $em->flush();
                return $this->json(['message' => "Compte vérifier "], 201);
            } else {
                return $this->json(['message' => "Erreur pas d'utilisateur trouver"], 403);
            }
        } catch (\Throwable $th) {
            return $this->json(['message' => "Erreur pas d'utilisateur trouver"], 403);
        }
    }
}
