<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouvel utilisateur
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'motdepasse' => 'required|string|min:6|confirmed',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:500',
            'ville' => 'nullable|string|max:100',
            'code_postal' => 'nullable|string|max:10',
            'pays' => 'nullable|string|max:100',
            'date_naissance' => 'nullable|date|before:today'
        ], [
            'nom.required' => 'Le nom est obligatoire',
            'prenom.required' => 'Le prénom est obligatoire',
            'email.required' => 'L\'email est obligatoire',
            'email.email' => 'L\'email doit être valide',
            'email.unique' => 'Cet email est déjà utilisé',
            'motdepasse.required' => 'Le mot de passe est obligatoire',
            'motdepasse.min' => 'Le mot de passe doit contenir au moins 6 caractères',
            'motdepasse.confirmed' => 'La confirmation du mot de passe ne correspond pas',
            'date_naissance.before' => 'La date de naissance doit être antérieure à aujourd\'hui'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'email' => $request->email,
                'mot_de_passe' => Hash::make($request->motdepasse),
                'telephone' => $request->telephone,
                'adresse' => $request->adresse,
                'ville' => $request->ville,
                'code_postal' => $request->code_postal,
                'pays' => $request->pays ?? 'France',
                'date_naissance' => $request->date_naissance,
                'role' => 'client',
                'actif' => true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Inscription réussie',
                'user' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'inscription'
            ], 500);
        }
    }

    /**
     * Connexion d'un utilisateur
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'motdepasse' => 'required|string'
        ], [
            'email.required' => 'L\'email est obligatoire',
            'email.email' => 'L\'email doit être valide',
            'motdepasse.required' => 'Le mot de passe est obligatoire'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $credentials = [
                'email' => $request->email,
                'password' => $request->motdepasse,
                'actif' => true
            ];

            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email ou mot de passe incorrect'
                ], 401);
            }

            $user = auth()->user();

            return response()->json([
                'success' => true,
                'message' => 'Connexion réussie',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'role' => $user->role,
                    'nom_complet' => $user->nom_complet,
                    'avatar_url' => $user->avatar_url
                ]
            ]);

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du token'
            ], 500);
        }
    }

    /**
     * Déconnexion de l'utilisateur
     */
    public function logout(): JsonResponse
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            
            return response()->json([
                'success' => true,
                'message' => 'Déconnexion réussie'
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la déconnexion'
            ], 500);
        }
    }

    /**
     * Obtenir les informations de l'utilisateur connecté
     */
    public function me(): JsonResponse
    {
        try {
            $user = auth()->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'telephone' => $user->telephone,
                    'adresse' => $user->adresse,
                    'ville' => $user->ville,
                    'code_postal' => $user->code_postal,
                    'pays' => $user->pays,
                    'date_naissance' => $user->date_naissance?->format('Y-m-d'),
                    'role' => $user->role,
                    'nom_complet' => $user->nom_complet,
                    'avatar_url' => $user->avatar_url,
                    'email_verifie' => !is_null($user->email_verifie_le),
                    'membre_depuis' => $user->created_at->format('Y-m-d')
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du profil'
            ], 500);
        }
    }

    /**
     * Rafraîchir le token JWT
     */
    public function refresh(): JsonResponse
    {
        try {
            $token = JWTAuth::refresh(JWTAuth::getToken());
            
            return response()->json([
                'success' => true,
                'token' => $token
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de rafraîchir le token'
            ], 401);
        }
    }
}