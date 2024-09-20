<?php

namespace App\Entity;

use App\Repository\CartRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CartRepository::class)]
class Cart
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $idUser = null;

    #[ORM\Column]
    private array $idProducts = [];

    #[ORM\Column]
    private ?\DateTimeImmutable $date_start = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable  $date_validation = null;

    /**
     * @var Collection<int, Order>
     */
    #[ORM\OneToMany(targetEntity: Order::class, mappedBy: 'idCart')]
    private Collection $orders;

    public function __construct()
    {
        $this->orders = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdUser(): ?int
    {
        return $this->idUser;
    }

    public function setIdUser(int $idUser): static
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

    public function setDateStart(\DateTimeImmutable  $date_start): static
    {
        $this->date_start = $date_start;

        return $this;
    }

    public function getDateValidation(): ?\DateTimeImmutable
    {
        return $this->date_validation;
    }

    public function setDateValidation(?\DateTimeImmutable  $date_validation): static
    {
        $this->date_validation = $date_validation;

        return $this;
    }

    /**
     * @return Collection<int, Order>
     */
    public function getOrders(): Collection
    {
        return $this->orders;
    }
}
