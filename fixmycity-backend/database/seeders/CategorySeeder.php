<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['name' => 'Potholes', 'icon' => '🕳️', 'color' => '#6b7280'],
            ['name' => 'Street Lighting', 'icon' => '💡', 'color' => '#fbbf24'],
            ['name' => 'Waste Management', 'icon' => '🗑️', 'color' => '#10b981'],
            ['name' => 'Water Supply', 'icon' => '💧', 'color' => '#3b82f6'],
            ['name' => 'Public Safety', 'icon' => '🛡️', 'color' => '#ef4444'],
            ['name' => 'Parks & Green Spaces', 'icon' => '🌳', 'color' => '#22c55e'],
            ['name' => 'Traffic Signs', 'icon' => '🛑', 'color' => '#f97316'],
            ['name' => 'Building & Infrastructure', 'icon' => '🏗️', 'color' => '#8b5cf6'],
        ];

        foreach ($categories as $cat) {
            Category::create(array_merge($cat, [
                'type' => 'issue',
                'is_active' => true
            ]));
        }
    }
}
