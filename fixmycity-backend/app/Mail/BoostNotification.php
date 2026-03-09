<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\UrbanIssue;
use App\Models\CommunityHelpRequest;

class BoostNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $item;
    public $boostLevel;
    public $itemType;

    
    public function __construct($item, $boostLevel, $itemType)
    {
        $this->item = $item;
        $this->boostLevel = $boostLevel;
        $this->itemType = $itemType;
    }

    
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'FixMyCity: Your Boost is Active! 🚀',
        );
    }

    
    public function content(): Content
    {
        return new Content(
            view: 'emails.boost_notification',
        );
    }

    
    public function attachments(): array
    {
        return [];
    }
}
