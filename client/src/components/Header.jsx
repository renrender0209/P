import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search, Menu, Mic, X } from 'lucide-react';

function Header() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  const handleSearch = (e, query = null) => {
    e?.preventDefault();
    const searchTerm = query || searchQuery.trim();
    if (searchTerm) {
      setLocation(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
      setSuggestions([]);
      setSelectedSuggestion(-1);
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedSuggestion(-1);
  };

  // Debounce suggestions fetch
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          handleSearch(null, suggestions[selectedSuggestion]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(null, suggestion);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 w-full bg-youtube-dark-bg border-b border-gray-800 z-50 h-14">
      <div className="flex items-center justify-between px-4 h-full">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-800 rounded-full transition-colors" data-testid="menu-button">
            <Menu size={20} />
          </button>
          <div 
            className="flex items-center space-x-1 cursor-pointer hover:bg-gray-800 rounded px-2 py-1 transition-colors"
            onClick={() => setLocation('/')}
            data-testid="logo-home"
          >
            <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center text-white font-bold text-sm">
              ▶
            </div>
            <span className="text-white text-xl font-bold">YouTube</span>
            <span className="text-gray-400 text-xs ml-1 bg-gray-800 px-1 rounded">JP</span>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="flex items-center max-w-2xl w-full mx-4">
          <form onSubmit={handleSearch} className="flex w-full">
            <div ref={searchRef} className="relative flex w-full max-w-lg">
              <input
                type="text"
                placeholder="検索"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                className="flex-1 h-10 px-4 bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none rounded-l-full"
                data-testid="search-input"
              />
              <button
                type="submit"
                className="h-10 px-6 bg-gray-800 border border-l-0 border-gray-600 hover:bg-gray-700 rounded-r-full flex items-center justify-center transition-colors"
                data-testid="search-button"
              >
                <Search size={18} />
              </button>
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-lg mt-1 py-2 z-50 shadow-xl search-suggestions"
                  data-testid="search-suggestions"
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 cursor-pointer text-white hover:bg-gray-700 flex items-center space-x-3 ${
                        selectedSuggestion === index ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => selectSuggestion(suggestion)}
                      data-testid={`suggestion-${index}`}
                    >
                      <Search size={16} className="text-gray-400" />
                      <span className="flex-1 text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              className="ml-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              data-testid="mic-button"
            >
              <Mic size={18} />
            </button>
          </form>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-blue-700 transition-colors" data-testid="user-avatar">
            U
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;