<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class PaymentController extends AbstractController
{
    #[Route('/api/process-payment', name: 'app_process_payment', methods: ["POST"])]
    public function processPayment(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $paymentMethodId = $data['payment_method_id'] ?? null;
        $zipCode = $data['zip_code'] ?? null;
        $adresse = $data['adresse'] ?? null;
        $phone = $data['phone'] ?? null;
        $amount = $data['amount'] ?? null;

        if (!$paymentMethodId || !$zipCode || !$adresse || !$phone || !$amount) {
            return $this->json(['error' => 'Missing fields'], 400);
        }

        \Stripe\Stripe::setApiKey('sk_test_51PqAVT06SlE6eckHEQR55kqsAjksr01Ky4RI6wPWKp9fOnGRRVe3qkf53GxSzS5prdPakXZ57N0ZzSkhzNOMis0D006JnabpM6');

        try {
            $paymentIntent = \Stripe\PaymentIntent::create([
                'amount' => $amount,
                'currency' => 'EUR',
                'payment_method' => $paymentMethodId,
                'confirm' => true,
                'automatic_payment_methods' => [
                    'enabled' => true,
                    'allow_redirects' => 'never'
                ],
            ]);

            if ($paymentIntent->status === 'requires_action' || $paymentIntent->status === 'requires_source_action') {
                return $this->json([
                    'client_secret' => $paymentIntent->client_secret,
                    'requires_action' => true,
                ]);
            }

            return $this->json(['success' => 'Paiement réussi'], 200);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
}
