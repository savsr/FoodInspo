'use client';

import { useState, useEffect } from 'react';

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/savsr/FoodInspo/tree/main/data';

const FILTER_OPTIONS = {
  mealType: ["Any", "Weeknight Dinner", "Quick Lunch", "Side Dish", "Weekend Showstopper", "BBQ", "Brunch", "Snack/Starter"],
  effort: ["Any", "Easy", "Medium", "Involved"],
  diet: ["Any", "Meat", "Vegetarian", "Vegan"],
  health: ["Any", "Light", "Balanced", "Indulgent"],
  cuisine: ["Any", "Asian", "Middle Eastern", "Indian", "Italian", "British", "Australian/Fresh", "Mexican/Latin", "Mediterranean", "American"],
  heroIngredient: ["Any", "Chicken", "Beef", "Lamb", "Pork", "Fish/Seafood", "Beans/Legumes", "Eggs", "Vegetables", "Pasta/Noodles", "Rice/Grains", "Tofu/Tempeh"],
  time: ["Any", "Under 30 mins", "30-60 mins", "1 hour+"]
};

const SOURCES = [
  { id: "ottolenghi", name: "Ottolenghi", emoji: "🥗" },
  { id: "ixtaBelfrage", name: "Ixta Belfrage", emoji: "🌶️" },
  { id: "laraLee", name: "Lara Lee", emoji: "🥥" },
  { id: "dishoom", name: "Dishoom", emoji: "☕" },
  { id: "billGranger", name: "Bill Granger", emoji: "🍳" },
  { id: "nigellaLawson", name: "Nigella", emoji: "🍫" },
  { id: "boldBeans", name: "Bold Beans", emoji: "🫘" },
  { id: "sixSeasons", name: "Six Seasons", emoji: "🥬" },
  { id: "seriousEats", name: "Serious Eats", emoji: "🔬" },
  { id: "dianaHenry", name: "Diana Henry", emoji: "🍂" },
  { id: "splashOfSoy", name: "Splash of Soy", emoji: "🥢" },
];

const HEALTH_COLORS = {
  "Light": "bg-green-500",
  "Balanced": "bg-amber-500", 
  "Indulgent": "bg-pink-500"
};

const DIET_COLORS = {
  "Vegan": "bg-emerald-600",
  "Vegetarian": "bg-lime-500",
  "Meat": "bg-red-400"
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('inspire');
  const [filters, setFilters] = useState({
    mealType: 'Any', effort: 'Any', diet: 'Any', health: 'Any',
    cuisine: 'Any', heroIngredient: 'Any', time: 'Any'
  });
  const [sourceFilter, setSourceFilter] = useState([]);
  const [inspiration, setInspiration] = useState(null);
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [inspRes, libRes] = await Promise.all([
        fetch(`${GITHUB_RAW_URL}/inspiration.json`).catch(() => null),
        fetch(`${GITHUB_RAW_URL}/library.json`).catch(() => null)
      ]);
      
      if (inspRes?.ok) setInspiration(await inspRes.json());
      if (libRes?.ok) setLibrary(await libRes.json());
    } catch (e) {
      console.log('Error loading data:', e);
    }
    setLoading(false);
  };

  const filterRecipes = (recipes) => {
    if (!recipes) return [];
    return recipes.filter(r => {
      if (filters.mealType !== 'Any' && r.mealType !== filters.mealType) return false;
      if (filters.effort !== 'Any' && r.effort !== filters.effort) return false;
      if (filters.diet !== 'Any' && r.diet !== filters.diet) return false;
      if (filters.health !== 'Any' && r.health !== filters.health) return false;
      if (filters.cuisine !== 'Any' && r.cuisine !== filters.cuisine) return false;
      if (filters.heroIngredient !== 'Any' && r.heroIngredient !== filters.heroIngredient) return false;
      if (filters.time !== 'Any' && r.time !== filters.time) return false;
      if (sourceFilter.length > 0 && !sourceFilter.some(s => r.source?.toLowerCase().includes(s.toLowerCase()))) return false;
      return true;
    });
  };

  const FilterSelect = ({ label, field, options }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-amber-400 font-medium">{label}</label>
      <select
        value={filters[field]}
        onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
        className="bg-stone-800 text-white border border-stone-700 rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  const RecipeCard = ({ recipe, showSave = false }) => (
    <div className="bg-stone-800 rounded-xl overflow-hidden hover:bg-stone-750 transition-all border border-stone-700 hover:border-amber-500/50">
      {recipe.imageUrl ? (
        <div className="h-48 overflow-hidden">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
          />
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-amber-600/20 to-orange-600/20 flex items-center justify-center">
          <span className="text-5xl">
            {recipe.heroIngredient?.includes('Chicken') ? '🍗' :
             recipe.heroIngredient?.includes('Beef') ? '🥩' :
             recipe.heroIngredient?.includes('Fish') ? '🐟' :
             recipe.heroIngredient?.includes('Beans') ? '🫘' :
             recipe.heroIngredient?.includes('Egg') ? '🍳' :
             recipe.heroIngredient?.includes('Pasta') ? '🍝' :
             recipe.heroIngredient?.includes('Vegetable') ? '🥬' :
             recipe.diet === 'Vegan' ? '🥗' :
             '🍽️'}
          </span>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {recipe.health && (
            <span className={`${HEALTH_COLORS[recipe.health] || 'bg-stone-600'} text-white text-xs px-2 py-1 rounded-full font-medium`}>
              {recipe.health}
            </span>
          )}
          {recipe.diet && (
            <span className={`${DIET_COLORS[recipe.diet] || 'bg-stone-600'} text-white text-xs px-2 py-1 rounded-full font-medium`}>
              {recipe.diet}
            </span>
          )}
          {recipe.time && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              ⏱️ {recipe.time}
            </span>
          )}
        </div>
        
        <h3 className="text-white font-bold text-lg mb-1">{recipe.title}</h3>
        
        <p className="text-amber-400 text-sm mb-2">
          📚 {recipe.source}
          {recipe.sourceDetail && recipe.sourceDetail !== recipe.source && (
            <span className="text-stone-400"> • {recipe.sourceDetail}</span>
          )}
        </p>
        
        {recipe.description && (
          <p className="text-stone-300 text-sm mb-2">{recipe.description}</p>
        )}
        
        {recipe.whyYoullLoveIt && (
          <p className="text-green-400 text-sm italic">💚 {recipe.whyYoullLoveIt}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-stone-700">
          {recipe.mealType && <span className="text-xs text-stone-400">🍽️ {recipe.mealType}</span>}
          {recipe.cuisine && <span className="text-xs text-stone-400">🌍 {recipe.cuisine}</span>}
          {recipe.heroIngredient && <span className="text-xs text-stone-400">⭐ {recipe.heroIngredient}</span>}
        </div>
        
        <div className="flex gap-2 mt-3">
          {recipe.sourceUrl && (
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-amber-600 hover:bg-amber-500 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              View Recipe →
            </a>
          )}
          {showSave && (
            <button className="bg-stone-700 hover:bg-stone-600 text-white py-2 px-4 rounded-lg text-sm transition-colors">
              💾 Save
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const filteredInspiration = filterRecipes(inspiration?.recipes);
  const filteredLibrary = filterRecipes(library?.recipes);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4 animate-bounce">🐔</p>
          <p className="text-amber-400 text-lg">Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900">
      {/* Header */}
      <header className="bg-gradient-to-b from-amber-600 via-orange-600 to-stone-900 pt-8 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-5xl">🐔</span>
            <div className="flex gap-2">
              {SOURCES.slice(0, 6).map(s => (
                <span key={s.id} className="text-2xl" title={s.name}>{s.emoji}</span>
              ))}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">CHICK FEED</h1>
          <p className="text-amber-200 mt-2 text-lg">Recipe inspiration from your favourite chefs</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-0 bg-stone-900 border-b border-stone-800 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('inspire')}
              className={`px-6 py-4 font-bold transition-colors ${
                activeTab === 'inspire' 
                  ? 'text-amber-400 border-b-2 border-amber-400' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              🎲 Inspire Me
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`px-6 py-4 font-bold transition-colors ${
                activeTab === 'library' 
                  ? 'text-amber-400 border-b-2 border-amber-400' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              📚 My Library ({library?.recipes?.length || 0})
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-stone-800 rounded-2xl p-6 mb-8 border border-stone-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">🔍 Filters</h2>
            <button
              onClick={() => {
                setFilters({
                  mealType: 'Any', effort: 'Any', diet: 'Any', health: 'Any',
                  cuisine: 'Any', heroIngredient: 'Any', time: 'Any'
                });
                setSourceFilter([]);
              }}
              className="text-amber-400 text-sm hover:text-amber-300"
            >
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-4">
            <FilterSelect label="Meal Type" field="mealType" options={FILTER_OPTIONS.mealType} />
            <FilterSelect label="Effort" field="effort" options={FILTER_OPTIONS.effort} />
            <FilterSelect label="Diet" field="diet" options={FILTER_OPTIONS.diet} />
            <FilterSelect label="Health" field="health" options={FILTER_OPTIONS.health} />
            <FilterSelect label="Cuisine" field="cuisine" options={FILTER_OPTIONS.cuisine} />
            <FilterSelect label="Hero Ingredient" field="heroIngredient" options={FILTER_OPTIONS.heroIngredient} />
            <FilterSelect label="Time" field="time" options={FILTER_OPTIONS.time} />
          </div>

          {/* Source chips */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-700">
            <span className="text-xs text-stone-400 self-center mr-2">Sources:</span>
            {SOURCES.map(source => (
              <button
                key={source.id}
                onClick={() => {
                  setSourceFilter(prev => 
                    prev.includes(source.name) 
                      ? prev.filter(s => s !== source.name)
                      : [...prev, source.name]
                  );
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  sourceFilter.includes(source.name)
                    ? 'bg-amber-500 text-white'
                    : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                }`}
              >
                {source.emoji} {source.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'inspire' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">🎲 Recipe Inspiration</h2>
                <p className="text-stone-400">
                  {filteredInspiration.length} recipes match your filters
                  {inspiration?.generatedAt && (
                    <span className="text-stone-500"> • Generated {new Date(inspiration.generatedAt).toLocaleDateString()}</span>
                  )}
                </p>
              </div>
              <button
                onClick={loadData}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                🔄 Refresh
              </button>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/50 text-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm">💡 To generate new ideas: Run <code className="bg-blue-900 px-2 py-1 rounded">generateInspiration()</code> in Google Apps Script, then click Refresh.</p>
            </div>

            {filteredInspiration.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-6xl mb-4">🍳</p>
                <p className="text-stone-400 text-lg">
                  {inspiration?.recipes?.length > 0 
                    ? 'No recipes match your filters. Try adjusting them.'
                    : 'No inspiration yet! Generate some in Apps Script.'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInspiration.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} showSave={true} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'library' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">📚 My Library</h2>
                <p className="text-stone-400">
                  {filteredLibrary.length} of {library?.recipes?.length || 0} recipes
                </p>
              </div>
            </div>

            {filteredLibrary.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-6xl mb-4">📚</p>
                <p className="text-stone-400 text-lg">
                  {library?.recipes?.length > 0 
                    ? 'No recipes match your filters. Try adjusting them.'
                    : 'Your library is empty. Save recipes from Inspire Me!'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLibrary.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-800 border-t border-stone-700 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-3xl mb-2">🐔🍳👨‍🍳</p>
          <p className="text-stone-500 text-sm">Chick Feed • Recipe inspiration powered by Gemini</p>
        </div>
      </footer>
    </div>
  );
}
