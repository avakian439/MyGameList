"use client";
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Game, UserGameData } from '@/lib/types';

interface GameModalProps {
    game: Game;
    userGameData?: UserGameData;
    isOpen: boolean;
    onClose: () => void;
}

export default function GameModal({ game, userGameData, isOpen, onClose }: GameModalProps) {
    // Close modal on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const latestReview = userGameData?.reviews?.[userGameData.reviews.length - 1];
    const genres = game.genres?.map(g => g.name).join(', ') || 'N/A';
    const platforms = game.platforms?.map(p => p.platform.name).join(', ') || 'N/A';

    const modalContent = (
        <div 
            className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div 
                className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Image */}
                <div className="relative h-64 w-full">
                    <Image 
                        src={game.background_image || "https://media.rawg.io/media/screenshots/df3/df397a86c8d5b4023fe13fa6dd7f140f.jpeg"}
                        alt={game.name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/50 to-transparent" />
                    
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-gray-900/80 hover:bg-gray-800 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h2 className="text-3xl font-bold text-white mb-2">{game.name}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                            {game.released && (
                                <span>{new Date(game.released).getFullYear()}</span>
                            )}
                            {game.metacritic && (
                                <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-400">
                                    Metacritic: {game.metacritic}
                                </span>
                            )}
                            {game.rating && (
                                <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/50 rounded text-blue-400">
                                    Rating: {game.rating}/5
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* User Status & Score */}
                    {userGameData && (
                        <div className="flex items-center gap-4 pb-4 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">Status:</span>
                                <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium capitalize">
                                    {userGameData.status}
                                </span>
                            </div>
                            {latestReview?.reviewScore && (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">Your Score:</span>
                                    <span className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium">
                                        {latestReview.reviewScore}/10
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Genres & Platforms */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">Genres</h3>
                            <p className="text-white">{genres}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">Platforms</h3>
                            <p className="text-white">{platforms}</p>
                        </div>
                    </div>

                    {/* Description */}
                    {game.description && (
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                            <div 
                                className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: game.description }}
                            />
                        </div>
                    )}

                    {/* Screenshots */}
                    {game.short_screenshots && game.short_screenshots.length > 1 && (
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Screenshots</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {game.short_screenshots.slice(1, 7).map((screenshot) => (
                                    <div key={screenshot.id} className="relative h-32 rounded overflow-hidden">
                                        <Image 
                                            src={screenshot.image}
                                            alt="Game screenshot"
                                            fill
                                            className="object-cover hover:scale-105 transition-transform"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* User Review */}
                    {latestReview?.reviewText && (
                        <div className="pt-4 border-t border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-3">Your Review</h3>
                            <p className="text-gray-300 italic">&quot;{latestReview.reviewText}&quot;</p>
                            {latestReview.reviewedAt && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Reviewed on {new Date(latestReview.reviewedAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
