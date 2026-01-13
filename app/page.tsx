'use client'
import { useState, useEffect,useRef } from 'react';
import {searchGames, getPopularGames, getTopRatedGames, type Game } from '@/lib/rawg-api';
import Link from 'next/link';
import { Gamepad2, Search} from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';

export default function HomePage() {
    const { isSignedIn } = useUser();
    const[searchQuery, setSearchQuery] = useState('');
    const[searchResult, setSearchResult] = useState<Game[]>([]);
    const[popularGames, setPopularGames] = useState<Game[]>([]);
    const[topRatedGames, setTopRatedGames] = useState<Game[]>([]);
    const[selectedFilter, setSelectedFilter] = useState<'popular' | 'top-rated'>('popular');
    const[currentPage, setCurrentPage] = useState(1);
    const[isSearching, setIsSearching] = useState(true);
    const[isLoading, setIsLoading] = useState(false);
   return(
       <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col justify-between gap-4">
                        <div className="flex">
                            {/* Logo */}
                            <Link href="/" className="flex flex-1 items-center space-x-3 group">
                                <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg group-hover:scale-105 transition-transform">
                                    <Gamepad2 size={28}/>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight">MYGAME<span className="text-purple-400">List</span></h1>
                                    <p className="text-gray-400 text-sm font-bold">Track your gaming collection</p>
                                </div>
                            </Link>
                            {/* Search */}
                            <div className="relative flex flex-2 max-w-2xl mx-auto justify-center">
                                <div className="relative">
                                    <Search className="absolute  left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for games..."
                                        className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500"
                                    />

                                </div>
                            </div>
                            {/* Acccount Management */}
                            <div className="flex-1 flex justify-end">
                                {isSignedIn ? (
                                    <>
                                        <Link href="/dashboard" className='ml-5 mr-5 self-center hover:text-purple-400 transition'>Dashboard</Link>
                                        <UserButton afterSignOutUrl="/"/>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/sign-up" className='ml-5 self-center hover:text-purple-400 transition'>Sign up</Link>
                                        <Link href="/sign-in" className='ml-5 mr-5 self-center hover:text-purple-400 transition'>Sign in</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
       </div>
   )
}