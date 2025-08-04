<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'mot_de_passe',
        'telephone',
        'adresse',
        'ville',
        'code_postal',
        'pays',
        'role',
        'date_naissance',
        'avatar',
        'email_verifie_le',
        'actif'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verifie_le' => 'datetime',
        'date_naissance' => 'date',
        'actif' => 'boolean',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
            'nom' => $this->nom,
            'prenom' => $this->prenom
        ];
    }

    /**
     * Get the password for the user.
     */
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    /**
     * Vérifier si l'utilisateur est administrateur
     */
    public function estAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Vérifier si l'utilisateur est client
     */
    public function estClient(): bool
    {
        return $this->role === 'client';
    }

    /**
     * Relation avec les commandes
     */
    public function commandes()
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    /**
     * Obtenir le nom complet
     */
    public function getNomCompletAttribute(): string
    {
        return $this->prenom . ' ' . $this->nom;
    }

    /**
     * Obtenir l'URL de l'avatar
     */
    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            return asset('storage/avatars/' . $this->avatar);
        }
        
        // Avatar par défaut basé sur les initiales
        $initiales = strtoupper(substr($this->prenom, 0, 1) . substr($this->nom, 0, 1));
        return "https://ui-avatars.com/api/?name={$initiales}&background=2563eb&color=ffffff&size=200";
    }

    /**
     * Scope pour les utilisateurs actifs
     */
    public function scopeActifs($query)
    {
        return $query->where('actif', true);
    }

    /**
     * Scope pour les administrateurs
     */
    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }

    /**
     * Scope pour les clients
     */
    public function scopeClients($query)
    {
        return $query->where('role', 'client');
    }
}