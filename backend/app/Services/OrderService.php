<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderService
{
    /**
     * Créer une nouvelle commande
     */
    public function creerCommande(User $user, array $donneesCommande, array $articlesCommande): Order
    {
        return DB::transaction(function () use ($user, $donneesCommande, $articlesCommande) {
            // Créer la commande
            $commande = Order::create([
                'numero_commande' => Order::genererNumeroCommande(),
                'user_id' => $user->id,
                'statut' => 'en_attente',
                'statut_paiement' => 'en_attente',
                'mode_paiement' => $donneesCommande['mode_paiement'] ?? 'avant_livraison',
                'sous_total' => 0,
                'frais_livraison' => $donneesCommande['frais_livraison'] ?? 0,
                'taxes' => $donneesCommande['taxes'] ?? 0,
                'remise' => $donneesCommande['remise'] ?? 0,
                'total' => 0,
                'nom_livraison' => $donneesCommande['nom_livraison'],
                'prenom_livraison' => $donneesCommande['prenom_livraison'],
                'adresse_livraison' => $donneesCommande['adresse_livraison'],
                'ville_livraison' => $donneesCommande['ville_livraison'],
                'code_postal_livraison' => $donneesCommande['code_postal_livraison'],
                'pays_livraison' => $donneesCommande['pays_livraison'] ?? 'France',
                'telephone_livraison' => $donneesCommande['telephone_livraison'] ?? null,
                'notes_client' => $donneesCommande['notes_client'] ?? null,
            ]);

            // Ajouter les articles à la commande
            $sousTotal = 0;
            foreach ($articlesCommande as $articleData) {
                $produit = Product::findOrFail($articleData['product_id']);
                
                // Vérifier le stock
                if ($produit->stock < $articleData['quantite']) {
                    throw new Exception("Stock insuffisant pour le produit: {$produit->nom}");
                }

                // Créer l'article de commande
                $article = OrderItem::create([
                    'order_id' => $commande->id,
                    'product_id' => $produit->id,
                    'nom_produit' => $produit->nom,
                    'description_produit' => $produit->description,
                    'prix_unitaire' => $produit->prix_final,
                    'quantite' => $articleData['quantite'],
                    'sku_produit' => $produit->sku,
                    'image_produit' => $produit->images ? [$produit->images[0]] : null,
                ]);

                $sousTotal += $article->total_ligne;

                // Décrémenter le stock
                $produit->decrementerStock($articleData['quantite']);
            }

            // Mettre à jour les totaux de la commande
            $commande->sous_total = $sousTotal;
            $commande->total = $sousTotal + $commande->frais_livraison + $commande->taxes - $commande->remise;
            $commande->save();

            return $commande->load('articles.produit');
        });
    }

    /**
     * Mettre à jour le statut d'une commande
     */
    public function mettreAJourStatut(Order $commande, string $nouveauStatut): Order
    {
        $statutsValides = ['en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree', 'annulee'];
        
        if (!in_array($nouveauStatut, $statutsValides)) {
            throw new Exception("Statut invalide: {$nouveauStatut}");
        }

        $commande->statut = $nouveauStatut;

        // Mettre à jour les dates selon le statut
        switch ($nouveauStatut) {
            case 'expediee':
                $commande->date_expedition = now();
                break;
            case 'livree':
                $commande->date_livraison = now();
                break;
        }

        $commande->save();

        return $commande;
    }

    /**
     * Mettre à jour le statut de paiement
     */
    public function mettreAJourStatutPaiement(Order $commande, string $nouveauStatut): Order
    {
        $statutsValides = ['en_attente', 'paye', 'rembourse', 'echec'];
        
        if (!in_array($nouveauStatut, $statutsValides)) {
            throw new Exception("Statut de paiement invalide: {$nouveauStatut}");
        }

        $commande->statut_paiement = $nouveauStatut;

        if ($nouveauStatut === 'paye') {
            $commande->date_paiement = now();
        }

        $commande->save();

        return $commande;
    }

    /**
     * Annuler une commande
     */
    public function annulerCommande(Order $commande, string $raison = null): Order
    {
        return DB::transaction(function () use ($commande, $raison) {
            // Remettre les produits en stock
            foreach ($commande->articles as $article) {
                $produit = $article->produit;
                if ($produit) {
                    $produit->incrementerStock($article->quantite);
                }
            }

            // Mettre à jour le statut
            $commande->statut = 'annulee';
            if ($raison) {
                $commande->notes_admin = ($commande->notes_admin ? $commande->notes_admin . "\n" : '') . 
                                       "Annulée: {$raison}";
            }
            $commande->save();

            return $commande;
        });
    }

    /**
     * Calculer les statistiques des commandes
     */
    public function obtenirStatistiques(int $jours = 30): array
    {
        $dateDebut = now()->subDays($jours);

        return [
            'total_commandes' => Order::where('created_at', '>=', $dateDebut)->count(),
            'commandes_confirmees' => Order::where('created_at', '>=', $dateDebut)
                                          ->where('statut', 'confirmee')->count(),
            'commandes_livrees' => Order::where('created_at', '>=', $dateDebut)
                                       ->where('statut', 'livree')->count(),
            'chiffre_affaires' => Order::where('created_at', '>=', $dateDebut)
                                      ->where('statut_paiement', 'paye')
                                      ->sum('total'),
            'panier_moyen' => Order::where('created_at', '>=', $dateDebut)
                                  ->where('statut_paiement', 'paye')
                                  ->avg('total'),
        ];
    }
}