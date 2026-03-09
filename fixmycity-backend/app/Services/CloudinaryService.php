<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Transformation\Resize;

class CloudinaryService
{
    protected $cloudinary;

    public function __construct()
    {

    }

    public function upload($file, $folder = 'fixmycity')
    {
        try {
            $result = cloudinary()->upload($file->getRealPath(), [
                'folder' => $folder,
                'transformation' => [
                    'quality' => 'auto',
                    'fetch_format' => 'auto'
                ]
            ])->getSecurePath();

            return $result;
        } catch (\Exception $e) {

            throw $e;
        }
    }
    
    
    public function uploadWithDetails($file, $folder = 'fixmycity')
    {
         try {
            $response = cloudinary()->upload($file->getRealPath(), [
                'folder' => $folder,
                'transformation' => [
                    'quality' => 'auto',
                    'fetch_format' => 'auto'
                ]
            ]);

            return [
                'url' => $response->getSecurePath(),
                'public_id' => $response->getPublicId(),
                'format' => $response->getExtension(),
                'width' => $response->getWidth(),
                'height' => $response->getHeight(),
            ];
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
