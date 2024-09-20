<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Whishlist;
use App\Repository\WhishlistRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class WhishlistController extends AbstractController
{
    #[Route('/api/whishlist', name: 'app_show_all_whishlist', methods: ["GET"])]
    public function show_all(WhishlistRepository $whishlistRepository): JsonResponse
    {

        try {
            $user = $this->getUser();
            $userRoles = $user->getRoles();

            if ($user instanceof User) {

                if (!in_array("ROLE_ADMIN", $userRoles)) {
                    return $this->json(["message" => "Accès refusé"], 403);
                }
            }
            $whishlists = $whishlistRepository->findAll();

            $data = [];

            foreach ($whishlists as $whishlist) {
                $data[] = [
                    "id" => $whishlist->getId(),
                    "id_products" => $whishlist->getIdProducts(),
                    "date_start" => $whishlist->getDateStart(),
                    "date_modification" => $whishlist->getDateModification()

                ];
            }
        } catch (\Throwable $th) {
            return $this->json(["message" => "Une erreur est survenue", "error" => $th], 500);
        }
        return $this->json(["data" => $data]);
    }

    #[Route('/api/whishlist/me', name: 'app_show_my_whishlist', methods: ["GET"], requirements: ['id' => '\d+'])]
    public function show_me(WhishlistRepository $whishlistRepository): JsonResponse
    {

        try {
            $user = $this->getUser();

            if ($user instanceof User) {

                $id = $user->getId();
            }

            $whishlist = $whishlistRepository->findOneBy(["idUser" => $id]);

            if (!$whishlist) {
                return $this->json(["message" => "Aucune whishlist trouvée"], 404);
            }

            $data = [
                "id" => $whishlist->getId(),
                "id_products" => $whishlist->getIdProducts(),
                "date_start" => $whishlist->getDateStart(),
                "date_modification" => $whishlist->getDateModification()
            ];
        } catch (\Throwable $th) {
            return $this->json(["message" => "Une erreur est survenue", "error" => $th], 500);
        }
        return $this->json(["data" => $data]);
    }

    #[Route('/api/whishlist/{id}', name: 'app_show_whishlist', methods: ["GET"], requirements: ['id' => '\d+'])]
    public function show(int $id, WhishlistRepository $whishlistRepository): JsonResponse
    {

        // try {
            $whishlist = $whishlistRepository->findOneBy(["idUser" => $id]);

            if (!$whishlist) {
                return $this->json(["message" => "Aucune whishlist trouvée"]);
            }

            $data = [
                "id" => $whishlist->getId(),
                "id_products" => $whishlist->getIdProducts(),
                "date_start" => $whishlist->getDateStart(),
                "date_modification" => $whishlist->getDateModification()
            ];
        // } catch (\Throwable $th) {
        //     return $this->json(["message" => "Une erreur est survenue", "error" => $th], 500);
        // }
        return $this->json(["data" => $data]);
    }

    #[Route("/api/whishlist", name: "app_create_whishlist", methods: ["POST"])]
    public function create(Request $request, WhishlistRepository $whishlistRepository, EntityManagerInterface $entityManager): JsonResponse
    {

        try {

            $data = json_decode($request->getContent(), true);

            $user = $this->getUser();

            $products = $data["idProducts"] ?? null;

            if (!$products) {
                return $this->json(["message" => "Veuillez ajouter des produits"]);
            }

            $whishlist = new Whishlist();
            $whishlist->setIdProducts($products);
            $whishlist->setIdUser($user);
            $whishlist->setDateStart(new \DateTimeImmutable());

            $entityManager->persist($whishlist);
            $entityManager->flush();
        } catch (\Throwable $th) {
            return $this->json(["message" => "Une erreur est survenue", "error" => $th], 500);
        }


        return $this->json(["message" => "Whishlist crée"]);
    }

    #[Route('/api/whishlist/{id}', name: 'app_update_whishlist', methods: ["PATCH"], requirements: ['id' => '\d+'])]
    public function update(int $id, Request $request, WhishlistRepository $whishlistRepository, EntityManagerInterface $entityManager): JsonResponse
    {

        try {
            $whishlist = $whishlistRepository->find($id);

            if (!$whishlist) {
                return $this->json(["message" => "Aucune Whishlist trouvée"]);
            }

            $user = $this->getUser();

            if ($user instanceof User) {
                $userId =$user->getId();
                if ($whishlist->getIdUser()->getId() != $user->getId()) {
                    return $this->json(["message" => "Acces refusé"], 403);
                }
            }


            $data = json_decode($request->getContent(), true);

            $products = $data["idProducts"] ?? null;

            // if (!$products) {
            //     return $this->json(["message" => "Veuillez ajouter des produits"]);
            // }

            $whishlist->setIdProducts($products);
            $entityManager->flush();

           
            $whishlist = $whishlistRepository->findOneBy(["idUser" => $userId]);

            if (!$whishlist) {
                return $this->json(["message" => "Aucune whishlist trouvée"], 404);
            }

            $data = [
                "id" => $whishlist->getId(),
                "id_products" => $whishlist->getIdProducts(),
                "date_start" => $whishlist->getDateStart(),
                "date_modification" => $whishlist->getDateModification()
            ];
        } catch (\Throwable $th) {
            return $this->json(["message" => "Une erreur est survenue", "error" => $th], 500);
        }

        return $this->json(["data" => $data]);
    }

    #[Route('/api/whishlist/{id}', name: 'app_delete_whishlist', methods: ["DELETE"], requirements: ['id' => '\d+'])]
    public function delete(int $id, Request $request, WhishlistRepository $whishlistRepository, EntityManagerInterface $entityManager): JsonResponse
    {

        try {
            $whishlist = $whishlistRepository->find($id);

            if (!$whishlist) {
                return $this->json(["message" => "Aucune Whishlist trouvée"]);
            }

            $user = $this->getUser();

            if ($user instanceof User) {

                if ($whishlist->getIdUser()->getId() != $user->getId()) {
                    return $this->json(["message" => "Acces refusé"], 403);
                }
            }


            $entityManager->remove($whishlist);
            $entityManager->flush();
        } catch (\Throwable $th) {
            return $this->json(["message" => "Une erreur est survenue", "error" => $th], 500);
        }

        return $this->json(["message" => "Whislist supprimée"]);
    }
}
