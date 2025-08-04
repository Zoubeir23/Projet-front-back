<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description');
            $table->string('slug')->unique();
            $table->decimal('prix', 10, 2);
            $table->decimal('prix_promo', 10, 2)->nullable();
            $table->timestamp('date_debut_promo')->nullable();
            $table->timestamp('date_fin_promo')->nullable();
            $table->integer('stock')->default(0);
            $table->unsignedBigInteger('category_id');
            $table->json('images')->nullable();
            $table->boolean('actif')->default(true);
            $table->decimal('poids', 8, 2)->nullable();
            $table->json('dimensions')->nullable(); // {longueur, largeur, hauteur}
            $table->string('marque')->nullable();
            $table->string('sku')->unique();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Clé étrangère
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            
            // Index pour améliorer les performances
            $table->index(['actif', 'category_id']);
            $table->index(['prix', 'actif']);
            $table->index('stock');
            $table->index('slug');
            $table->index('sku');
            $table->index(['date_debut_promo', 'date_fin_promo']);
            
            // Index de recherche full-text pour PostgreSQL
            $table->index(['nom', 'description']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};