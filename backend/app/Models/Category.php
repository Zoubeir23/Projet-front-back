<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'categories';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'description',
        'image',
        'actif',
        'parent_id',
        'ordre',
        'slug',
        'meta_title',
        'meta_description'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'actif' => 'boolean',
        'ordre' => 'integer',
    ];

    /**
     * The attributes that should be appended to arrays.
     *
     * @var array
     */
    protected $appends = [
        'url_image',
        'nombre_produits'
    ];

    /**
     * Relation avec les produits
     */
    public function produits()
    {
        return $this->hasMany(Product::class, 'category_id');
    }

    /**
     * Relation avec la catégorie parent
     */
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Relation avec les sous-catégories
     */
    public function enfants()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Obtenir l'URL complète de l'image
     */
    public function getUrlImageAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }
        return asset('storage/categories/' . $this->image);
    }

    /**
     * Obtenir le nombre de produits dans cette catégorie
     */
    public function getNombreProduitsAttribute(): int
    {
        return $this->produits()->actifs()->count();
    }

    /**
     * Scope pour les catégories actives
     */
    public function scopeActives($query)
    {
        return $query->where('actif', true);
    }

    /**
     * Scope pour les catégories principales (sans parent)
     */
    public function scopePrincipales($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope pour les sous-catégories
     */
    public function scopeSousCategories($query)
    {
        return $query->whereNotNull('parent_id');
    }

    /**
     * Scope pour ordonner par ordre
     */
    public function scopeOrdonnees($query)
    {
        return $query->orderBy('ordre', 'asc')->orderBy('nom', 'asc');
    }

    /**
     * Vérifier si c'est une catégorie principale
     */
    public function estPrincipale(): bool
    {
        return is_null($this->parent_id);
    }

    /**
     * Vérifier si la catégorie a des sous-catégories
     */
    public function aSousCategories(): bool
    {
        return $this->enfants()->count() > 0;
    }

    /**
     * Obtenir toutes les sous-catégories récursivement
     */
    public function toutesLesSousCategories()
    {
        return $this->enfants()->with('toutesLesSousCategories');
    }

    /**
     * Obtenir le chemin complet de la catégorie
     */
    public function getCheminCompletAttribute(): string
    {
        $chemin = collect([$this->nom]);
        $parent = $this->parent;
        
        while ($parent) {
            $chemin->prepend($parent->nom);
            $parent = $parent->parent;
        }
        
        return $chemin->implode(' > ');
    }
}