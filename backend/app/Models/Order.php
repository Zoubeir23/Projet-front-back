<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'numero_commande',
        'user_id',
        'statut',
        'statut_paiement',
        'mode_paiement',
        'sous_total',
        'frais_livraison',
        'taxes',
        'remise',
        'total',
        'nom_livraison',
        'prenom_livraison',
        'adresse_livraison',
        'ville_livraison',
        'code_postal_livraison',
        'pays_livraison',
        'telephone_livraison',
        'nom_facturation',
        'prenom_facturation',
        'adresse_facturation',
        'ville_facturation',
        'code_postal_facturation',
        'pays_facturation',
        'notes_client',
        'notes_admin',
        'code_promo',
        'date_paiement',
        'date_expedition',
        'date_livraison'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'sous_total' => 'decimal:2',
        'frais_livraison' => 'decimal:2',
        'taxes' => 'decimal:2',
        'remise' => 'decimal:2',
        'total' => 'decimal:2',
        'date_paiement' => 'datetime',
        'date_expedition' => 'datetime',
        'date_livraison' => 'datetime',
    ];

    /**
     * The attributes that should be appended to arrays.
     *
     * @var array
     */
    protected $appends = [
        'adresse_livraison_complete',
        'statut_libelle',
        'statut_paiement_libelle'
    ];

    /**
     * Relation avec l'utilisateur
     */
    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relation avec les articles de commande
     */
    public function articles()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    /**
     * Obtenir l'adresse de livraison complète
     */
    public function getAdresseLivraisonCompleteAttribute(): string
    {
        return $this->adresse_livraison . ', ' . 
               $this->code_postal_livraison . ' ' . 
               $this->ville_livraison . ', ' . 
               $this->pays_livraison;
    }

    /**
     * Obtenir le libellé du statut
     */
    public function getStatutLibelleAttribute(): string
    {
        return match($this->statut) {
            'en_attente' => 'En attente',
            'confirmee' => 'Confirmée',
            'en_preparation' => 'En préparation',
            'expediee' => 'Expédiée',
            'livree' => 'Livrée',
            'annulee' => 'Annulée',
            default => 'Inconnu'
        };
    }

    /**
     * Obtenir le libellé du statut de paiement
     */
    public function getStatutPaiementLibelleAttribute(): string
    {
        return match($this->statut_paiement) {
            'en_attente' => 'En attente',
            'paye' => 'Payé',
            'rembourse' => 'Remboursé',
            'echec' => 'Échec',
            default => 'Inconnu'
        };
    }

    /**
     * Scope pour les commandes d'un utilisateur
     */
    public function scopeParUtilisateur($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope pour les commandes par statut
     */
    public function scopeParStatut($query, $statut)
    {
        return $query->where('statut', $statut);
    }

    /**
     * Scope pour les commandes récentes
     */
    public function scopeRecentes($query, $jours = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($jours));
    }

    /**
     * Générer un numéro de commande unique
     */
    public static function genererNumeroCommande(): string
    {
        do {
            $numero = 'CMD-' . date('Y') . '-' . str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT);
        } while (self::where('numero_commande', $numero)->exists());
        
        return $numero;
    }

    /**
     * Calculer le total de la commande
     */
    public function calculerTotal(): void
    {
        $sousTotal = $this->articles->sum(function ($article) {
            return $article->prix_unitaire * $article->quantite;
        });

        $this->sous_total = $sousTotal;
        $this->total = $sousTotal + $this->frais_livraison + $this->taxes - $this->remise;
        $this->save();
    }
}