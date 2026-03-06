<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Transformation\Resize;

class CloudinaryService
{
    protected $cloudinary;

    public function __construct()
    {
        // Cloudinary is configured via CLOUDINARY_URL env var automatically by the SDK
        // or we can instantiate it manually if needed.
        // For lavarel-cloudinary package, it might use a Facade, 
        // but here we will implement a basic wrapper or use the Facade if available.
        // Given the composer.json has "cloudinary-labs/cloudinary-laravel", we should use its Facade.
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
            // Fallback or rethrow
            throw $e;
        }
    }
    
    /**
     * Upload and get full result including public_id
     */
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
