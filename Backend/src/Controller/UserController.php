<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class UserController extends AbstractController
{

    #[Route('/api/users', name: 'api_users', methods: ['GET'])]
    public function index(UserRepository $userRepository): JsonResponse
    {
        try {
            $user = $this->getUser();

            if (!$user || !in_array("ROLE_ADMIN", $user->getRoles())) {
                return $this->json(['message' => "Accès refusé"], 403);
            }

            $users = $userRepository->findAll();
            $data = [];

            foreach ($users as $userInfo) {
                $codePromos = $userInfo->getCodePromotions();
                $codePromoData = [];

                foreach ($codePromos as $codePromo) {
                    $codePromoData[] = [
                        "id" => $codePromo->getId(),
                        "code" => $codePromo->getCode(),
                        "value" => $codePromo->getValue(),
                        "created_at" => $codePromo->getCreatedAt(),
                        "expire_at" => $codePromo->getExpireAt(),
                    ];
                }

                $userData = [
                    "id" => $userInfo->getId(),
                    "email" => $userInfo->getEmail(),
                    "roles" => $userInfo->getRoles(),
                    "firstname" => $userInfo->getFirstname(),
                    "lastname" => $userInfo->getLastname(),
                    "picture" => $userInfo->getPicture(),
                    "verified" => $userInfo->isVerified(),
                    "is_actif" => $userInfo->isActif(),
                    "created_at" => $userInfo->getCreatedAt(),
                    "updated_at" => $userInfo->getUpdatedAt(),
                    "code_promo" => $codePromoData,
                    "commandes" => []
                ];

                $orders = $userInfo->getOrders();
                foreach ($orders as $order) {
                    $productsData = [];

                    foreach ($order->getProducts() as $product) {
                        $reduction = $product->getReduction();
                        $productsData[] = [
                            'id' => $product->getId(),
                            'title' => $product->getTitle(),
                            'price' => $product->getPrice(),
                            "reduction" => $reduction ? $reduction->getReduction() : 0,
                        ];
                    }

                    $userData['commandes'][] = [
                        "id" => $order->getId(),
                        "reception_date" => $order->getReceptionDate() ? $order->getReceptionDate() : null,
                        "order_date" => $order->getOrderDate(),
                        "status" => $order->getStatus(),
                        "products" => $productsData,
                    ];
                }

                $userComplements = [];
                foreach ($userInfo->getUserComplements() as $complement) {
                    $userComplements[] = [
                        "id" => $complement->getId(),
                        "zipcode" => $complement->getZipCode(),
                        "adresse" => $complement->getAdresse(),
                        "phone" => $complement->getPhone()
                    ];
                }

                $userData["user_complements"] = $userComplements;

                $data[] = $userData;
            }
        } catch (\Throwable $th) {
            return $this->json(['message' => "Une erreur est survenue"], 500);
        }

        return $this->json(["data" => $data]);
    }


    #[Route('/api/users/{id}', name: 'api_user_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(int $id, UserRepository $userRepository): JsonResponse
    {
        try {
            $user = $this->getUser();
            $userRoles = $user->getRoles();

            if (!in_array("ROLE_ADMIN", $userRoles)) {
                return $this->json(["message" => "Accès refusé"], 403);
            }

            $users = $userRepository->find($id);
            $data = [];

            foreach ($users as $user) {
                $userData = [
                    "id" => $user->getId(),
                    "email" => $user->getEmail(),
                    "roles" => $user->getRoles(),
                    "firstname" => $user->getFirstname(),
                    "lastname" => $user->getLastname(),
                    "picture" => $user->getPicture(),
                    "verified" => $user->isVerified(),
                    "created_at" => $user->getCreatedAt(),
                    "updated_at" => $user->getUpdatedAt(),
                ];


                $codePromotions = [];
                foreach ($user->getCodePromotions() as $codePromo) {
                    $codePromotions[] = [
                        "id" => $codePromo->getId(),
                        "code" => $codePromo->getCode(),
                        "value" => $codePromo->getValue(),
                        "created_at" => $codePromo->getCreatedAt()->format('Y-m-d H:i:s'),
                        "expire_at" => $codePromo->getExpireAt()->format('Y-m-d H:i:s'),
                    ];
                }

                $userData["code_promo"] = $codePromotions;


                $userComplements = [];
                foreach ($user->getUserComplements() as $complement) {
                    $userComplements[] = [
                        "id" => $complement->getId(),
                        "zipcode" => $complement->getZipCode(),
                        "adresse" => $complement->getAdresse(),
                        "phone" => $complement->getPhone()
                    ];
                }

                $userData["user_complements"] = $userComplements;

                $data[] = $userData;
            }
        } catch (\Throwable $th) {
            return $this->json(['message' => "Une erreur est survenue"], 500);
        }

        return $this->json(["data" => $data]);
    }

    #[Route("/api/users/me", name: "api_user_show_me", methods: ["GET"])]
    public function showMe(UserRepository $userRepository): JsonResponse
    {
        try {
            $user = $this->getUser();

            if (!$user instanceof User) {
                return $this->json(['message' => "Utilisateur non trouvé"], 404);
            }

            $userId = $user->getId();
            $userInfo = $userRepository->find($userId);

            if (!$userInfo) {
                return $this->json(['message' => "Utilisateur non trouvé"], 404);
            }

            $codePromos = $userInfo->getCodePromotions();
            $codePromoData = [];

            foreach ($codePromos as $codePromo) {
                $codePromoData[] = [
                    "id" => $codePromo->getId(),
                    "code" => $codePromo->getCode(),
                    "value" => $codePromo->getValue(),
                    "created_at" => $codePromo->getCreatedAt()->format('Y-m-d H:i:s'),
                    "expire_at" => $codePromo->getExpireAt()->format('Y-m-d H:i:s'),
                ];
            }


            $data = [
                "id" => $userInfo->getId(),
                "email" => $userInfo->getEmail(),
                "roles" => $userInfo->getRoles(),
                "firstname" => $userInfo->getFirstname(),
                "lastname" => $userInfo->getLastname(),
                "picture" => $userInfo->getPicture(),
                "verified" => $userInfo->isVerified(),
                "created_at" => $userInfo->getCreatedAt()->format('Y-m-d H:i:s'),
                "updated_at" => $userInfo->getUpdatedAt()->format('Y-m-d H:i:s'),
                "code_promo" => $codePromoData,
                "commandes" => []
            ];


            $orders = $userInfo->getOrders();

            foreach ($orders as $order) {
                $productsData = [];


                foreach ($order->getProducts() as $product) {
                    $reduction = $product->getReduction();
                    $productsData[] = [
                        'id' => $product->getId(),
                        'title' => $product->getTitle(),
                        'price' => $product->getPrice(),
                        "reduction" => $reduction ? $reduction->getReduction() : 0,
                    ];
                }

                $data['commandes'][] = [
                    "id" => $order->getId(),
                    "reception_date" => $order->getReceptionDate() ? $order->getReceptionDate()->format('Y-m-d H:i:s') : null,
                    "order_date" => $order->getOrderDate()->format('Y-m-d H:i:s'),
                    "status" => $order->getStatus(),
                    "products" => $productsData,
                ];
            }




            $userComplements = [];
            foreach ($userInfo->getUserComplements() as $complement) {
                $userComplements[] = [
                    "id" => $complement->getId(),
                    "zipcode" => $complement->getZipCode(),
                    "adresse" => $complement->getAdresse(),
                    "phone" => $complement->getPhone()
                ];
            }

            $data["user_complements"] = $userComplements;
        } catch (\Throwable $th) {
            return $this->json(['message' => "Une erreur est survenue"], 500);
        }

        return $this->json(["data" => $data]);
    }


    #[Route("/api/users/{id}", name: "api_user_update", methods: ["PATCH"], requirements: ['id' => '\d+'])]
    public function update(int $id, Request $request, EntityManagerInterface $entityManager, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {

        try {
            $data = json_decode($request->getContent(), true);

            $user = $userRepository->find($id);

            if (!$user) {
                return $this->json(["message" => "Aucun utilisateur trouvé"], 404);
            }

            $userConnected = $this->getUser();

            if ($userConnected->getUserIdentifier() !== $user->getEmail() && !in_array("ROLE_ADMIN", $userConnected->getRoles())) {
                return $this->json(["message" => "Accès refusé"], 403);
            }

            $picture = $data["picture"] ?? null;
            $password = $data["password"] ?? null;
            $firstname = $data["firstname"] ?? null;
            $lastname = $data["lastname"] ?? null;
            $email = $data["email"] ?? null;
            $roles = $data["roles"] ?? null;

            if ($picture !== null) {
                $user->setPicture($picture);
            }
            if ($email !== null) {
                $email_exist = $userRepository->findByEmail($email);

                if ($email_exist) {
                    return $this->json(["message" => "Email deja pris"], 400);
                } else {

                    $user->setEmail($email);
                }
            }

            if ($password !== null) {
                $hashedPassword = $passwordHasher->hashPassword($user, $password);
                $user->setPassword($hashedPassword);
            }

            if ($firstname !== null) {
                $user->setFirstname($firstname);
            }

            if ($lastname !== null) {
                $user->setLastname($lastname);
            }

            if ($roles !== null) {

                if ($roles == "user") {
                    $role = ['ROLE_USER'];
                } elseif ($roles == "admin") {
                    $role = ['ROLE_ADMIN'];
                }


                $user->setRoles($role);
            }
            $user->setUpdatedAt(new \DateTimeImmutable());

            $entityManager->flush();
        } catch (\Throwable $th) {
            return $this->json(['message' => "Erreur est survenue"], 500);
        }


        return $this->json([
            "message" => "Utilisateur modifié avec succès",
            "data" => [
                "id" => $user->getId(),
                "email" => $user->getEmail(),
                "roles" => $user->getRoles(),
                "firstname" => $user->getFirstname(),
                "lastname" => $user->getLastname(),
                "picture" => $user->getPicture(),
                "created_at" => $user->getCreatedAt(),
                "updated_at" => $user->getUpdatedAt(),
            ]
        ]);
    }

    #[Route("/api/users/{id}", name: 'api_user_delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function delete(int $id, Request $request, EntityManagerInterface $entityManager, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {

        try {
            $user = $userRepository->find($id);

            if (!$user) {
                return $this->json(["message" => "Aucun utilisateur trouvé"], 404);
            }

            $userConnected = $this->getUser();

            if ($userConnected->getUserIdentifier() !== $user->getEmail() && !in_array("ROLE_ADMIN", $userConnected->getRoles())) {
                return $this->json(["message" => "Accès refusé"], 403);
            }

            $user->setActif(false);
            $hashedPassword = $passwordHasher->hashPassword($user, "deleteduserdefinitively");
            $user->setPassword($hashedPassword);
            $entityManager->flush();
        } catch (\Throwable $th) {
            return $this->json(['message' => "Erreur est survenue"], 500);
        }

        return $this->json(["message" => "Utilisateur supprimé avec succès"]);
    }

    #[Route("/api/users", name: "api_user_create", methods: ["POST"])]
    public function create(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, UserRepository $userRepository): JsonResponse
    {

        try {
            $userConnected = $this->getUser();

            if (!in_array("ROLE_ADMIN", $userConnected->getRoles())) {
                return $this->json(["message" => "Accès refusé"], 403);
            }

            $data = json_decode($request->getContent(), true);

            $email = $data['email'] ?? null;
            $password = $data['password'] ?? null;
            $firstname = $data['firstname'] ?? null;
            $lastname = $data['lastname'] ?? null;

            if (!$email || !$password || !$firstname || !$lastname) {
                return $this->json(["message" => "Tous les champs sont requis"], 400);
            }

            $email_exist = $userRepository->findOneBy(["email" => $email]);

            if ($email_exist) {
                return $this->json(["message" => "Email deja pris"], 400);
            } else {
            }

            $user = new User();
            $user->setEmail($email);
            $user->setFirstname($firstname);
            $user->setLastname($lastname);
            $user->setRoles(['ROLE_USER']);
            $hashedPassword = $passwordHasher->hashPassword($user, $password);
            $user->setPassword($hashedPassword);
            $user->setCreatedAt(new \DateTimeImmutable());
            $user->setUpdatedAt(new \DateTimeImmutable());
            $user->setVerified(false);
            $user->setPicture($data['picture'] ?? null);
            $user->setActif(true);

            $entityManager->persist($user);
            $entityManager->flush();
        } catch (\Throwable $th) {
            return $this->json(['message' => "Erreu est survenue"], 500);
        }


        return $this->json([
            "message" => "Utilisateur créé avec succès",
            "data" => [
                "id" => $user->getId(),
                "email" => $user->getEmail(),
                "roles" => $user->getRoles(),
                "firstname" => $user->getFirstname(),
                "lastname" => $user->getLastname(),
                "created_at" => $user->getCreatedAt(),
                "updated_at" => $user->getUpdatedAt(),
            ]
        ], 201);
    }

    #[Route('/reset-password/{token}', name: "app_reset_password", methods: ['PATCH'])]
    public function resetPassword($token, UserRepository $userRepository, Request $request, UserPasswordHasherInterface $userPasswordHasherInterface, EntityManagerInterface $em)
    {
        try {
            $data = json_decode($request->getContent(), true);
            $user = $userRepository->findOneBy(["token" => $token]);

            if ($user instanceof User) {
                $passwordHash = $userPasswordHasherInterface->hashPassword($user, $data['password']);
                $user->setPassword($passwordHash);
                $em->persist($user);
                $em->flush();
            } else {
                return $this->json(['message' => "Erreur est survenue"], 403);
            }
            return $this->json(['message' => "Mot de passe modifier"], 200);
        } catch (\Throwable $th) {
            return $this->json(['message' => "Erreur est survenue"], 500);
        }
    }


    #[Route('/api/users/admin', name: 'api_all_admin', methods: ['GET'])]
    public function getAdmin(UserRepository $userRepository): JsonResponse
    {
        try {
            $user = $this->getUser();
            $userRoles = $user->getRoles();

            if (!in_array("ROLE_ADMIN", $userRoles)) {
                return $this->json(["message" => "Accès refusé"], 403);
            }


            $users = $userRepository->findAdmins();
            $data = [];

            foreach ($users as $user) {
                $userComplements = [];
                foreach ($user->getUserComplements() as $complement) {
                    $userComplements[] = [
                        "id" => $complement->getId(),
                        "zipcode" => $complement->getZipCode(),
                        "adresse" => $complement->getSexe(),
                        "phone" => $complement->getPhone()
                    ];
                }

                $codePromos = $user->getCodePromotions();
                $codePromoData = [];

                foreach ($codePromos as $codePromo) {
                    $codePromoData[] = [
                        "id" => $codePromo->getId(),
                        "code" => $codePromo->getCode(),
                        "value" => $codePromo->getValue(),
                        "created_at" => $codePromo->getCreatedAt()->format('Y-m-d H:i:s'),
                        "expire_at" => $codePromo->getExpireAt()->format('Y-m-d H:i:s'),
                    ];
                }

                $data[] = [
                    "id" => $user->getId(),
                    "email" => $user->getEmail(),
                    "roles" => $user->getRoles(),
                    "firstname" => $user->getFirstname(),
                    "lastname" => $user->getLastname(),
                    "picture" => $user->getPicture(),
                    "verified" => $user->isVerified(),
                    "created_at" => $user->getCreatedAt(),
                    "updated_at" => $user->getUpdatedAt(),
                    "is_actif" => $user->isActif(),
                    "user_complements" => $userComplements,
                    "code_promo" => $codePromoData,
                    "commandes" => []
                ];
            }
        } catch (\Throwable $th) {
            return $this->json(['message' => "Une erreur est survenue"], 500);
        }

        return $this->json(["data" => $data]);
    }

    #[Route('/api/getmyinformation', name: 'app_get_my_information', methods: ['GET'])]
    #[IsGranted('PUBLIC_ACCESS')]
    public function getMyInformation()
    {
        try {
            $user = $this->getUser();
            if (!$user instanceof User) {
                return $this->json('Utilisateur inconue', 404);
            }

            $userComplement = $user->getUserComplements()->first();
            $userJson = [
                "email" => $user->getEmail(),
                "firstname" => $user->getFirstname(),
                "lastname" => $user->getLastname(),
                "adresse" => $userComplement->getAdresse(),
                "phone" => $userComplement->getPhone(),
                "postCode" => $userComplement->getZipCode(),
            ];
            return $this->json($userJson, 200);
        } catch (\Throwable $th) {
            return $this->json(`ERREUR SERVEUR, $th`, 500);
        }
    }
}
