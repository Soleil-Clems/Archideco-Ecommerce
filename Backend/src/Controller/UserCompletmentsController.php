<?php

namespace App\Controller;

use App\Entity\UserComplements;
use App\Entity\User;
use App\Repository\UserComplementsRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class UserCompletmentsController extends AbstractController
{
    #[Route('/api/users/complements/{userId}', name: 'app_show_user_completments', methods: ["GET"])]
    public function index(int $userId, UserComplementsRepository $repository): JsonResponse
    {
        try {

            $user = $this->getUser();
            $userRoles = $user->getRoles();
            
            if (!in_array("ROLE_ADMIN", $userRoles)) {
                return $this->json(["message" => "Accès refusé"], 403);
            }
            $userComplements = $repository->findByUserId($userId);

            if (!$userComplements) {
                return $this->json(["message" => "Informations introuvables"], 404);
            }

            $data = [
                "id" => $userComplements->getId(),
                "user_id" => $userComplements->getUserId(),
                "zipcode" => $userComplements->getZipCode(),
                "adresse" => $userComplements->getAdresse(),
                "sexe" => $userComplements->getSexe(),
                "phone" => $userComplements->getPhone()
            ];
        } catch (\Throwable $th) {
            return $this->json(['message' => "Une erreur est survenue"], 500);
        }
        return $this->json(["message" => $data]);
    }

    #[Route('/api/users/complements', name: 'app_create_user_completments', methods: ["POST"])]
public function create(EntityManagerInterface $entityManager, Request $request): JsonResponse
{
    try {
        $user = $this->getUser();
    
        if ($user instanceof User) {
            $userId = $user->getId();
        } else {
            return $this->json(['message' => "Aucun utilisateur trouvé"], 404);
        }
    
        $data = json_decode($request->getContent(), true);
        $zipCode = $data['zip_code'] ?? null;
        $adresse = $data['adresse'] ?? null;
        $sexe = $data['sexe'] ?? null;
        $phone = $data['phone'] ?? null;
    
        error_log("User ID: " . $userId);
        error_log("Zip Code: " . $zipCode);
        error_log("Adresse: " . $adresse);
        error_log("Sexe: " . $sexe);
        error_log("Phone: " . $phone);
    
        $userComplements = new UserComplements();
    
        if ($zipCode) {
            $userComplements->setZipCode($zipCode);
        }
    
        if ($adresse) {
            $userComplements->setAdresse($adresse);
        }
    
        if ($sexe) {
            $userComplements->setSexe($sexe);
        }
    
        if ($phone) {
            $userComplements->setPhone($phone);
        }
    
        $userComplements->setUserId($user);
    
        $entityManager->persist($userComplements);
        $entityManager->flush();
    
        return $this->json(['message' => 'ca marche'], JsonResponse::HTTP_CREATED);
    
    } catch (\Throwable $th) {
        error_log("Erreur capturée: " . $th->getMessage());
        return $this->json(['message' => "Une erreur est survenue"], 500);
    }
}
      

    #[Route('/api/users/complements/{userId}', name: 'app_update_user_completments', methods: ["PATCH"])]
    public function update(int $userId, Request $request, UserComplementsRepository $repository, EntityManagerInterface $entityManager): JsonResponse
    {

        try {
            $data = json_decode($request->getContent(), true);
            $userComplements = $repository->findByUserId($userId);

            if (!$userComplements) {
                return $this->json(["message" => "Informations introuvables"], 404);
            }

            $zipCode = $data['zip_code'] ?? null;
            $adresse = $data['adresse'] ?? null;
            $sexe = $data['sexe'] ?? null;
            $phone = $data['phone'] ?? null;


            if ($zipCode) {
                $userComplements->setZipCode($zipCode);
            }

            if ($adresse) {
                $userComplements->setAdresse($adresse);
            }

            if ($sexe) {
                $userComplements->setSexe($sexe);
            }

            if ($phone) {
                $userComplements->setPhone($phone);
            }
            $entityManager->flush();
        } catch (\Throwable $th) {
            return $this->json(['message' => "Une erreur est survenue"], 500);
        }

        return $this->json(["data" => $data, "message" => "Mise a jour reussi"]);
    }

    #[Route('/api/users/complements/{userId}', name: 'app_delete_user_completments', methods: ["DELETE"])]
    public function delete(int $userId, Request $request, UserComplementsRepository $repository, EntityManagerInterface $entityManager): JsonResponse
    {

        try {

            $userComplements = $repository->findByUserId($userId);

            if (!$userComplements) {
                return $this->json(["message" => "Informations introuvables"], 404);
            }

            $user = $this->getUser();
            if ($user instanceof User) {
                $user_id = $user->getId();
            } else {
                return $this->json(["message" => "Utilisateur inconnu"], 401);
            } 

            if($user_id != $userId){
                return $this->json(["message" => "Acces refusé"], 403);
            }

            $entityManager->remove($userComplements);
            $entityManager->flush();
        } catch (\Throwable $th) {
            return $this->json(['message' => "Une erreur est survenue"], 500);
        }

        return $this->json(["message" => "Informations supprimées"]);
    }
}
