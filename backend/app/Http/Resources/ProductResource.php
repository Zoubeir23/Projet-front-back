<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'description' => $this->description,
            'slug' => $this->slug,
            'prix' => $this->prix,
            'prix_promo' => $this->prix_promo,
            'prix_final' => $this->prix_final,
            'en_promotion' => $this->en_promotion,
            'stock' => $this->stock,
            'statut_stock' => $this->statut_stock,
            'images' => $this->url_images,
            'premiere_image' => $this->premiere_image,
            'marque' => $this->marque,
            'sku' => $this->sku,
            'poids' => $this->poids,
            'dimensions' => $this->dimensions,
            'actif' => $this->actif,
            'categorie' => new CategoryResource($this->whenLoaded('categorie')),
            'note_moyenne' => round($this->note_moyenne, 1),
            'nombre_avis' => $this->nombre_avis,
            'dans_wishlist' => $this->when(auth()->check(), function () {
                return $this->estDansWishlist(auth()->id());
            }),
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'date_creation' => $this->created_at?->format('Y-m-d H:i:s'),
            'date_modification' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}