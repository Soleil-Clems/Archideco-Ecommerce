<?php

namespace App\Service;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JWTModifier
{
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $payload = $event->getData();
        $user = $event->getUser();

        $payload['firstname'] = $user->getFirstname();
        $payload['Lastname'] = $user->getLastname();
        $payload['userId'] = $user->getId();

        $event->setData($payload);
    }
}
