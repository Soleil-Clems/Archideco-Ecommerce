<?php

namespace App\Controller;

use App\Entity\Cart;
use App\Entity\User;
use App\Repository\CartRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class CartController extends AbstractController
{
    #[Route('/api/carts', name: 'app_show_all_carts', methods: ["GET"])]
    public function show_all(CartRepository $cartRepository): JsonResponse
    {
        try {
            $user = $this->getUser();
            $userRoles = $user->getRoles();

            if (!in_array("ROLE_ADMIN", $userRoles)) {
                return $this->json(["message" => "Accès refusé"], 403);
            }

            $carts = $cartRepository->findAll();
            $data = [];


            foreach ($carts as $cart) {
                $data[] = [
                    "id" => $cart->getId(),
                    "id_user" => $cart->getIdUser(),
                    "id_products" => $cart->getIdProducts(),
                    "date_start" => $cart->getDateStart()
                ];
            }
        } catch (\Throwable $th) {
            return $this->json(["message" => "Une erreur est survenue"]);
        }

        return $this->json(["message" => $data]);
    }

    #[Route('/api/carts/{id}', name: 'app_show_cart', methods: ["GET"],  requirements: ['id' => '\d+'])]
    public function show(int $id, CartRepository $cartRepository): JsonResponse
    {
        try {
            $user = $this->getUser();
            $userRoles = $user->getRoles();

            if (!in_array("ROLE_ADMIN", $userRoles)) {
                return $this->json(["message" => "Accès refusé"], 403);
            }

            $cart = $cartRepository->findOneBy(["idUser" => $id]);

            if (!$cart) {
                return $this->json(["message" => "Aucune cart trouvée"], 400);
            }

            $data = [
                "id" => $cart->getId(),
                "id_user" => $cart->getIdUser(),
                "id_products" => $cart->getIdProducts(),
                "date_start" => $cart->getDateStart()
            ];
        } catch (\Throwable $th) {
            return $this->json(["message" => "Une erreur est survenue"]);
        }

        return $this->json(["data" => $data]);
    }

    #[Route('/api/carts/me', name: 'app_show_my_cart', methods: ["GET"],  requirements: ['id' => '\d+'])]
    public function show_user_cart(CartRepository $cartRepository): JsonResponse
    {
        try {

            $user = $this->getUser();

            if ($user instanceof USER) {
                $userId = $user->getId();
            } else {
                return $this->json(["message" => "Utilisateur inconnu"]);
            }
            $cart = $cartRepository->findByUserCart($userId);

            if (!$cart) {
                return $this->json(["message" => "Aucune cart trouvée"], 404);
            }

            $data = [
                "id" => $cart->getId(),
                "id_user" => $cart->getIdUser(),
                "id_products" => $cart->getIdProducts(),
                "date_start" => $cart->getDateStart()
            ];
        } catch (\Throwable $th) {
            return $this->json(["message" => "Une erreur est survenue"], 500);
        }

        return $this->json(["data" => $data]);
    }

    #[Route('/api/carts', name: 'app_create_cart', methods: ["POST"])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $user = $this->getUser();

            if ($user instanceof USER) {
                $userId = $user->getId();
            } else {
                return $this->json(["message" => "Utilisateur inconnu"]);
            }

            $products = $data["idProducts"] ?? null;

            if (!$products) {
                return $this->json(["message" => "Veuillez ajouter des produits"]);
            }

            $cart = new Cart();
            $cart->setIdUser($userId);
            $cart->setIdProducts($products);
            $cart->setDateStart(new \DateTimeImmutable());

            $entityManager->persist($cart);
            $entityManager->flush();
        } catch (\Throwable $th) {
            return $this->json(["message" => "Une erreur est survenue"], 500);
        }

        return $this->json(['message' => 'Panier crée']);
    }

    #[Route('/api/carts/{id}', name: 'app_delete_cart', methods: ["DELETE"], requirements: ['id' => '\d+'])]
    public function delete(int $id, EntityManagerInterface $entityManager, CartRepository $cartRepository): JsonResponse
    {
        try {
            $cart = $cartRepository->find($id);
            if (!$cart) {
                return $this->json(["message" => "Panier non trouvé"], 404);
            }

            $user = $this->getUser();

            if ($user instanceof User) {
                $user_id = $user->getId();
            } else {
                return $this->json(["message" => "Utilisateur inconnu"], 401);
            }

            if ($cart->getIdUser() != $user_id) {
                return $this->json(["message" => "Accès refusé"], 403);
            }



            $entityManager->remove($cart);
            $entityManager->flush();

            return $this->json(["message" => "Panier supprimé"]);
        } catch (\Throwable $th) {
            return $this->json(["message" => "Une erreur est survenue"], 500);
        }
    }

    #[Route('/api/carts/{id}', name: 'app_update_cart', methods: ["PATCH"], requirements: ['id' => '\d+'])]
    public function update(int $id, Request $request, EntityManagerInterface $entityManager, CartRepository $cartRepository): JsonResponse
    {
        try {
            $cart = $cartRepository->find($id);
            if (!$cart) {
                return $this->json(["message" => "Panier non trouvé"], 404);
            }


            $data = json_decode($request->getContent(), true);

            $user = $this->getUser();

            if ($user instanceof User) {
                $user_id = $user->getId();
            } else {
                return $this->json(["message" => "Utilisateur inconnu"], 401);
            }

            if ($cart->getIdUser() != $user_id) {
                return $this->json(["message" => "Accès refusé"], 403);
            }

            $products = $data["idProducts"] ?? null;



            $cart->setIdProducts($products);
            $entityManager->flush();

            $cart = $cartRepository->findByUserCart($user_id);

            if (!$cart) {
                return $this->json(["message" => "Aucune cart trouvée"], 404);
            }

            $data = [
                "id" => $cart->getId(),
                "id_user" => $cart->getIdUser(),
                "id_products" => $cart->getIdProducts(),
                "date_start" => $cart->getDateStart()
            ];
        } catch (\Throwable $th) {
            return $this->json(["message" => "Une erreur est survenue"], 500);
        }

        return $this->json(["data" => $data]);
    }


    #[Route('/api/deleteMyCart', name: "app_delte_my_cart", methods: ['GET'])]
    public function deleteMyCart(EntityManagerInterface $entityManager, CartRepository $cartRepository)
    {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();

        // Vérifier si l'utilisateur est connecté
        if (!$user instanceof User) {
            return $this->json([
                'status' => 'error',
                'message' => "Vous n'êtes pas connecté."
            ], 401);
        }

        // Récupérer le panier de l'utilisateur
        $cartUser = $cartRepository->findOneBy(['idUser' => $user->getId()]);

        // Vérifier si le panier existe
        if (!$cartUser) {
            return $this->json([
                'status' => 'error',
                'message' => "Aucun panier trouvé pour cet utilisateur."
            ], 404);
        }

        // Supprimer le panier
        $entityManager->remove($cartUser);
        $entityManager->flush();

        // Retourner une réponse de succès
        return $this->json([
            'status' => 'success',
            'message' => "Le panier a été supprimé avec succès."
        ]);
    }
}
