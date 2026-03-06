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

    /**
     * Create a new message instance.
     */
    public function __construct($item, $boostLevel, $itemType)
    {
        $this->item = $item;
        $this->boostLevel = $boostLevel;
        $this->itemType = $itemType;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'FixMyCity: Your Boost is Active! 🚀',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.boost_notification',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
