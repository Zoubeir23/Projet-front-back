<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'products';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'description',
        'prix',
        'stock',
        'category_id',
        'images',
        'actif',
        'poids',
        'dimensions',
        'marque',
        'sku',
        'prix_promo',
        'date_debut_promo',
        'date_fin_promo',
        'meta_title',
        'meta_description',
        'slug'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'prix' => 'decimal:2',
        'prix_promo' => 'decimal:2',
        'stock' => 'integer',
        'actif' => 'boolean',
        'images' => 'array',
        'dimensions' => 'array',
        'date_debut_promo' => 'datetime',
        'date_fin_promo' => 'datetime',
    ];

    /**
     * The attributes that should be appended to arrays.
     *
     * @var array
     */
    protected $appends = [
        'prix_final',
        'en_promotion',
        'premiere_image',
        'url_images',
        'statut_stock',
        'note_moyenne',
        'nombre_avis'
    ];

    /**
     * Relation avec la catégorie
     */
    public function categorie()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Relation avec les articles de commande
     */
    public function articlesCommande()
    {
        return $this->hasMany(OrderItem::class, 'product_id');
    }

    /**
     * Relation avec les avis
     */
    public function avis()
    {
        return $this->hasMany(Review::class, 'product_id');
    }

    /**
     * Relation avec les wishlists
     */
    public function wishlists()
    {
        return $this->hasMany(Wishlist::class, 'product_id');
    }

    /**
     * Obtenir le prix final (avec promotion si applicable)
     */
    public function getPrixFinalAttribute(): float
    {
        if ($this->en_promotion) {
            return (float) $this->prix_promo;
        }
        return (float) $this->prix;
    }

    /**
     * Vérifier si le produit est en promotion
     */
    public function getEnPromotionAttribute(): bool
    {
        if (!$this->prix_promo || !$this->date_debut_promo || !$this->date_fin_promo) {
            return false;
        }

        $maintenant = now();
        return $maintenant->between($this->date_debut_promo, $this->date_fin_promo);
    }

    /**
     * Obtenir la première image
     */
    public function getPremiereImageAttribute(): ?string
    {
        if (empty($this->images)) {
            return null;
        }
        return $this->images[0] ?? null;
    }

    /**
     * Obtenir les URLs complètes des images
     */
    public function getUrlImagesAttribute(): array
    {
        if (empty($this->images)) {
            return [];
        }

        return array_map(function ($image) {
            return asset('storage/products/' . $image);
        }, $this->images);
    }

    /**
     * Obtenir le statut du stock
     */
    public function getStatutStockAttribute(): string
    {
        if ($this->stock <= 0) {
            return 'rupture';
        } elseif ($this->stock <= 5) {
            return 'faible';
        } else {
            return 'disponible';
        }
    }

    /**
     * Scope pour les produits actifs
     */
    public function scopeActifs($query)
    {
        return $query->where('actif', true);
    }

    /**
     * Scope pour les produits en stock
     */
    public function scopeEnStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    /**
     * Scope pour les produits en promotion
     */
    public function scopeEnPromotion($query)
    {
        return $query->whereNotNull('prix_promo')
                    ->whereNotNull('date_debut_promo')
                    ->whereNotNull('date_fin_promo')
                    ->where('date_debut_promo', '<=', now())
                    ->where('date_fin_promo', '>=', now());
    }

    /**
     * Scope pour rechercher par nom ou description
     */
    public function scopeRecherche($query, $terme)
    {
        return $query->where(function ($q) use ($terme) {
            $q->where('nom', 'ILIKE', "%{$terme}%")
              ->orWhere('description', 'ILIKE', "%{$terme}%")
              ->orWhere('marque', 'ILIKE', "%{$terme}%")
              ->orWhere('sku', 'ILIKE', "%{$terme}%");
        });
    }

    /**
     * Scope pour filtrer par catégorie
     */
    public function scopeParCategorie($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Scope pour filtrer par prix
     */
    public function scopeParPrix($query, $prixMin = null, $prixMax = null)
    {
        if ($prixMin !== null) {
            $query->where('prix', '>=', $prixMin);
        }
        
        if ($prixMax !== null) {
            $query->where('prix', '<=', $prixMax);
        }
        
        return $query;
    }

    /**
     * Décrémenter le stock
     */
    public function decrementerStock(int $quantite): bool
    {
        if ($this->stock >= $quantite) {
            $this->decrement('stock', $quantite);
            return true;
        }
        return false;
    }

    /**
     * Incrémenter le stock
     */
    public function incrementerStock(int $quantite): void
    {
        $this->increment('stock', $quantite);
    }

    /**
     * Obtenir la note moyenne du produit
     */
    public function getNoteMoyenneAttribute(): float
    {
        return $this->avis()->actifs()->moderes()->avg('note') ?? 0;
    }

    /**
     * Obtenir le nombre d'avis du produit
     */
    public function getNombreAvisAttribute(): int
    {
        return $this->avis()->actifs()->moderes()->count();
    }

    /**
     * Vérifier si le produit est dans la wishlist d'un utilisateur
     */
    public function estDansWishlist(int $userId): bool
    {
        return $this->wishlists()->where('user_id', $userId)->exists();
    }
}