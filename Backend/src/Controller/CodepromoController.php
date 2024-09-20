<?php

namespace App\Controller;

use App\Emails\EmailService;
use App\Entity\CodePromotion;
use App\Entity\User;
use App\Repository\CodePromotionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class CodepromoController extends AbstractController
{
    private $entityManager;
    public $mailerService;

    public function __construct(EntityManagerInterface $entityManager, EmailService $emailService)
    {
        $this->entityManager = $entityManager;
        $this->mailerService = $emailService;
    }

    #[Route("/api/codepromo", name: "create_codepromo", methods: ["POST"])]
    public function createCodePromo(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $userId = $data['user_id'] ?? null;
            $code = $data['code'] ?? null;
            $value = $data['value'] ?? null;
            $expireAt = $data['expire_at'] ?? null;

            if (!$userId || !$code || !$value || !$expireAt) {
                return new JsonResponse(['error' => 'Missing required fields'], 400);
            }

            $user = $entityManager->getRepository(User::class)->find($userId);
            if (!$user) {
                return new JsonResponse(['error' => 'User not found'], 404);
            }

            $codePromo = new CodePromotion();
            $codePromo->setUserId($user);
            $codePromo->setCode($code);
            $codePromo->setValue($value);
            $codePromo->setCreatedAt(new \DateTimeImmutable());
            $codePromo->setExpireAt(new \DateTimeImmutable($expireAt));

            $lastname =  $user->getLastname();
            $firstname =  $user->getFirstname();
            $email = $user->getEmail();

            $this->mailerService->sendEmail(
                $email,
                "Votre code promotionel !",
                "emails/promotionCode.html.twig",
                [
                    "firstname" => $firstname,
                    "lastname" => $lastname,
                    "value" => $value,
                    "code" => $code,
                    "expiration" => $expireAt
                ]
            );

            $entityManager->persist($codePromo);
            $entityManager->flush();

            return new JsonResponse(['message' => ['Code promo cree', "succes"]], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    #[Route("/api/codepromo", name: "get_all_codepromos", methods: ["GET"])]
    public function getAllCodePromos(EntityManagerInterface $entityManager, CodePromotionRepository $repository): JsonResponse
    {
        try {
            $user = $this->getUser();
            $userRoles = $user->getRoles();

            if (!in_array("ROLE_ADMIN", $userRoles)) {
                return $this->json(["message" => "Accès refusé"], 403);
            }

            $codePromos = $repository->findAll();
            $data = [];

            foreach ($codePromos as $codePromo) {
                $data[] = [
                    'id' => $codePromo->getId(),
                    'code' => $codePromo->getCode(),
                    'value' => $codePromo->getValue(),
                    'created_at' => $codePromo->getCreatedAt()->format('Y-m-d H:i:s'),
                    'expire_at' => $codePromo->getExpireAt()->format('Y-m-d H:i:s'),
                ];
            }

            return new JsonResponse($data, 200);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    #[Route("/api/codepromo/me", name: "get_codepromo_by_user", methods: ["GET"])]
    public function getCodePromoByUser(int $userId, CodePromotionRepository $repository): JsonResponse
    {
        try {

            $user = $this->getUser();
            if (!$user) {
                return $this->json(['message' => 'Utilisateur non authentifié'], 401);
            }


            $userRoles = $user->getRoles();
            if (!in_array("ROLE_ADMIN", $userRoles)) {
                return $this->json(['message' => 'Accès refusé'], 403);
            }


            $codePromos = $repository->findBy(['userId' => $userId]);

            if (empty($codePromos)) {
                return $this->json(['message' => 'Aucun code promo trouvé pour cet utilisateur'], 404);
            }


            $data = [];
            foreach ($codePromos as $codePromo) {
                if (!$codePromo instanceof CodePromotion) {
                    return $this->json(['message' => 'Erreur de données'], 500);
                }

                $data[] = [
                    'id' => $codePromo->getId(),
                    'code' => $codePromo->getCode(),
                    'value' => $codePromo->getValue(),
                    'created_at' => $codePromo->getCreatedAt()->format('Y-m-d H:i:s'),
                    'expire_at' => $codePromo->getExpireAt()->format('Y-m-d H:i:s'),
                ];
            }

            return new JsonResponse($data, 200);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Une erreur est survenue  ' . $e->getMessage()], 500);
        }
    }

    #[Route('/api/codepromo/verify', name: 'api_verify_codePromo', methods: ['POST'])]
    public function verifyCodePromo(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $codePromotion = $data['codePromotion'];
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json("Erreur lors de l'authentification", 403);
        }

        $codePromoUser = $user->getCodePromotions();
        $codePromotionJson = [];

        foreach ($codePromoUser as $code) {
            if ($code->getCode() === $codePromotion) {
                $codePromotionJson = [
                    "id" => $code->getId(),
                    "value" => $code->getValue(),
                    "expire_at" => $code->getExpireAt()
                ];
            }
        }

        if (!empty($codePromotionJson)) {
            return $this->json($codePromotionJson, 200);
        }

        return $this->json('Aucun code promotion trouvé', 404);
    }

    #[Route('/api/deleteCodePromo', name: 'app_delete_code_promo', methods: ['POST'])]
    public function deletepromocode(Request $request, CodePromotionRepository $codePromotionRepository, EntityManagerInterface $entityManagerInterface)
    {
        try {
            $user = $this->getUser();

            if (!$user instanceof User) {
                return $this->json("Pas d'utilisateur trouver", 404);
            }
            $data = json_decode($request->getContent(), true);
            $codePromo = $data['codePromo'];
            $code = $codePromotionRepository->findOneBy(['code' => $codePromo]);

            $entityManagerInterface->remove($code);
            $entityManagerInterface->flush();
            return $this->json('Code promo supprimer', 200);
        } catch (\Throwable $th) {
            return $this->json('Erreur serveur', 500);
        }
    }
}
