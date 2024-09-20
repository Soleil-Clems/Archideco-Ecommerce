<?php

namespace App\Entity;

use App\Repository\ProductsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductsRepository::class)]
class Products
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'products')]
    private ?Categories $categories = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $price = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $deliveryDelay = null;

    #[ORM\Column(nullable: true)]
    private ?array $sizes = null;

    #[ORM\Column]
    private array $images = [];

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $weight = null;

    #[ORM\Column(nullable: true)]
    private ?array $additionalData = null;

    /**
     * @var Collection<int, ProductsComments>
     */
    #[ORM\OneToMany(mappedBy: 'idProducts', targetEntity: ProductsComments::class)]
    private Collection $productsComments;

    /**
     * @var Collection<int, Notation>
     */
    #[ORM\OneToMany(mappedBy: 'idProducts', targetEntity: Notation::class)]
    private Collection $notations;

    #[ORM\OneToOne(mappedBy: 'id_category', cascade: ['persist', 'remove'])]
    private ?Reduction $reduction = null;

    public function __construct()
    {
        $this->productsComments = new ArrayCollection();
        $this->notations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCategories(): ?Categories
    {
        return $this->categories;
    }

    public function setCategories(?Categories $categories): static
    {
        $this->categories = $categories;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(?string $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDeliveryDelay(): ?string
    {
        return $this->deliveryDelay;
    }

    public function setDeliveryDelay(?string $deliveryDelay): static
    {
        $this->deliveryDelay = $deliveryDelay;

        return $this;
    }

    public function getSizes(): ?array
    {
        return $this->sizes;
    }

    public function setSizes(?array $sizes): static
    {
        $this->sizes = $sizes;

        return $this;
    }

    public function getImages(): array
    {
        return $this->images;
    }

    public function setImages(array $images): static
    {
        $this->images = $images;

        return $this;
    }

    public function getWeight(): ?string
    {
        return $this->weight;
    }

    public function setWeight(?string $weight): static
    {
        $this->weight = $weight;

        return $this;
    }

    public function getAdditionalData(): ?array
    {
        return $this->additionalData;
    }

    public function setAdditionalData(?array $additionalData): static
    {
        $this->additionalData = $additionalData;

        return $this;
    }

    /**
     * @return Collection<int, ProductsComments>
     */
    public function getProductsComments(): Collection
    {
        return $this->productsComments;
    }

    public function addProductsComment(ProductsComments $productsComment): static
    {
        if (!$this->productsComments->contains($productsComment)) {
            $this->productsComments->add($productsComment);
            $productsComment->setIdProducts($this);
        }

        return $this;
    }

    public function removeProductsComment(ProductsComments $productsComment): static
    {
        if ($this->productsComments->removeElement($productsComment)) {
            // set the owning side to null (unless already changed)
            if ($productsComment->getIdProducts() === $this) {
                $productsComment->setIdProducts(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Notation>
     */
    public function getNotations(): Collection
    {
        return $this->notations;
    }

    public function addNotation(Notation $notation): static
    {
        if (!$this->notations->contains($notation)) {
            $this->notations->add($notation);
            $notation->setIdProducts($this);
        }

        return $this;
    }

    public function removeNotation(Notation $notation): static
    {
        if ($this->notations->removeElement($notation)) {
           
            if ($notation->getIdProducts() === $this) {
                $notation->setIdProducts(null);
            }
        }

        return $this;
    }

    public function getReduction(): ?Reduction
    {
        return $this->reduction;
    }

    public function setReduction(?Reduction $reduction): static
    {
        // unset the owning side of the relation if necessary
        if ($reduction === null && $this->reduction !== null) {
            $this->reduction->setIdCategory(null);
        }

        // set the owning side of the relation if necessary
        if ($reduction !== null && $reduction->getIdCategory() !== $this) {
            $reduction->setIdCategory($this);
        }

        $this->reduction = $reduction;

        return $this;
    }
}
