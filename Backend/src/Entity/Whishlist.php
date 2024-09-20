<?php

namespace App\Entity;

use App\Repository\WhishlistRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: WhishlistRepository::class)]
class Whishlist
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'whishlists')]
    private ?User $idUser = null;

    #[ORM\Column]
    private array $idProducts = [];

    #[ORM\Column]
    private ?\DateTimeImmutable $date_start = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $date_modification = null;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdUser(): ?User
    {
        return $this->idUser;
    }

    public function setIdUser(?User $idUser): static
    {
        $this->idUser = $idUser;

        return $this;
    }

    public function getIdProducts(): array
    {
        return $this->idProducts;
    }

    public function setIdProducts(array $idProducts): static
    {
        $this->idProducts = $idProducts;

        return $this;
    }

    public function getDateStart(): ?\DateTimeImmutable
    {
        return $this->date_start;
    }

    public function setDateStart(\DateTimeImmutable $date_start): static
    {
        $this->date_start = $date_start;

        return $this;
    }

    public function getDateModification(): ?\DateTimeImmutable
    {
        return $this->date_modification;
    }

    public function setDateModification(?\DateTimeImmutable $date_modification): static
    {
        $this->date_modification = $date_modification;

        return $this;
    }
}
