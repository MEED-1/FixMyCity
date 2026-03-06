<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Citizen
        User::updateOrCreate(
            ['email' => 'citizen@fixmycity.com'],
            [
                'name' => 'John Citizen',
                'password' => Hash::make('password'),
                'role' => 'citizen',
            ]
        );

        // Agent
        User::updateOrCreate(
            ['email' => 'agent@fixmycity.com'],
            [
                'name' => 'Agent Smith',
                'password' => Hash::make('password'),
                'role' => 'agent',
            ]
        );

        // Admin
        User::updateOrCreate(
            ['email' => 'admin@fixmycity.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );
    }
}
