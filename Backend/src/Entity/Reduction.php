<?php

namespace App\Entity;

use App\Repository\ReductionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ReductionRepository::class)]
class Reduction
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'reduction', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(name: 'id_category_id', referencedColumnName: 'id', nullable: true)]
    private ?Products $id_category = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $end_at = null;

    #[ORM\Column(type: Types::BIGINT, nullable: true)]
    private ?string $reduction = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdCategory(): ?Products
    {
        return $this->id_category;
    }

    public function setIdCategory(?Products $id_category): static
    {
        $this->id_category = $id_category;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getEndAt(): ?\DateTimeImmutable
    {
        return $this->end_at;
    }

    public function setEndAt(\DateTimeImmutable $end_at): static
    {
        $this->end_at = $end_at;

        return $this;
    }

    public function getReduction(): ?string
    {
        return $this->reduction;
    }

    public function setReduction(string $reduction): static
    {
        $this->reduction = $reduction;

        return $this;
    }
}
