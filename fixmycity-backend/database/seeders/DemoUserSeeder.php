<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\Municipality;

class DemoUserSeeder extends Seeder
{
    public function run()
    {
        $municipality = Municipality::first();
        $municipalityId = $municipality ? $municipality->name : 'Agadir';

        User::create([
            'name' => 'System Admin',
            'email' => 'admin@fixmycity.ma',
            'password' => Hash::make('Admin1234'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Municipality Agent',
            'email' => 'agent@fixmycity.ma',
            'password' => Hash::make('Agent1234'),
            'role' => 'agent',
            'municipality_id' => $municipalityId,
            'municipality' => $municipalityId,
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Active Citizen',
            'email' => 'citizen@fixmycity.ma',
            'password' => Hash::make('Citizen1234'),
            'role' => 'citizen',
            'municipality' => $municipalityId,
            'is_active' => true,
        ]);
    }
}
