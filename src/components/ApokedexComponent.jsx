import { useEffect, useState } from "react";

const typeColors = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  ice: "bg-blue-200",
  fighting: "bg-orange-600",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-300",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-gray-600",
  ghost: "bg-indigo-700",
  dragon: "bg-purple-700",
  dark: "bg-gray-800",
  steel: "bg-gray-400",
  fairy: "bg-pink-300",
  normal: "bg-gray-300",
};

export default function ApokedexComponent() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=151&offset=0`
      );
      const data = await response.json();

      const details = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return await res.json();
        })
      );

      setPokemonList(details);
    } catch (error) {
      console.error("Error al obtener datos de los Pokémon:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const filteredPokemons = search
    ? pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      )
    : pokemonList;

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: "#abebc6" }}>
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Pokédex</h1>

      {/* Campo de búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Buscar Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Grid de Pokémon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        {filteredPokemons.map((pokemon) => {
          const hp = pokemon.stats?.[0]?.base_stat || 0;
          const attack = pokemon.stats?.[1]?.base_stat || 0;
          const defense = pokemon.stats?.[2]?.base_stat || 0;
          const specialAttack = pokemon.stats?.[3]?.base_stat || 0;

          return (
            <div
              key={pokemon.id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-lg"
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                alt={pokemon.name}
                className="w-32 h-32 mb-2"
              />
              <h2 className="text-lg font-semibold text-gray-700 capitalize mb-2">
                {pokemon.name}
              </h2>

              {/* Tipos */}
              <div className="flex gap-2 mb-3 flex-wrap justify-center">
                {pokemon.types.map(({ type }) => (
                  <span
                    key={type.name}
                    className={`text-white text-xs font-semibold px-2 py-1 rounded-full ${typeColors[type.name] || "bg-gray-400"}`}
                  >
                    {type.name}
                  </span>
                ))}
              </div>

              {/* Barras de estadísticas */}
              <div className="w-full">
                {[["PS", hp], ["ATQ", attack], ["DEF", defense], ["ESP-ATQ", specialAttack]].map(
                  ([label, value]) => (
                    <div key={label} className="mb-1">
                      <span className="text-xs font-medium text-gray-600">
                        {label}: {value}
                      </span>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${Math.min(value, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensaje si no hay resultados */}
      {filteredPokemons.length === 0 && (
        <p className="text-center text-gray-500">No se encontraron Pokémon</p>
      )}

      {/* Botón Cargar más (opcional, ya no es necesario con los 151 iniciales) */}
      <div className="flex justify-center">
        <button
          onClick={fetchPokemons}
          disabled={loading}
          className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Cargando..." : "Cargar más"}
        </button>
      </div>
    </div>
  );
}
