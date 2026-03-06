<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Municipality;

class MunicipalitySeeder extends Seeder
{
    public function run()
    {
        $municipalities = [
            ['name' => 'Agadir', 'region' => 'Souss-Massa', 'code' => 'AGD-01', 'contact_info' => 'contact@agadir.ma'],
            ['name' => 'Inezgane', 'region' => 'Souss-Massa', 'code' => 'INZ-02', 'contact_info' => 'contact@inezgane.ma'],
            ['name' => 'Ait Melloul', 'region' => 'Souss-Massa', 'code' => 'ATM-03', 'contact_info' => 'contact@aitmelloul.ma'],
            ['name' => 'Dcheira El Jihadia', 'region' => 'Souss-Massa', 'code' => 'DCH-04', 'contact_info' => 'contact@dcheira.ma'],
            ['name' => 'Drargua', 'region' => 'Souss-Massa', 'code' => 'DRG-05', 'contact_info' => 'contact@drargua.ma'],
        ];

        foreach ($municipalities as $mun) {
            Municipality::create(array_merge($mun, ['is_active' => true]));
        }
    }
}
