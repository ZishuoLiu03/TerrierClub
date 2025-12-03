import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def load_and_process_data(filepath):
    """Loads the club data and preprocesses the descriptions."""
    try:
        df = pd.read_csv(filepath, encoding='cp1252')
        print("Successfully loaded with encoding: cp1252")
    except UnicodeDecodeError:
        print(f"Error: Could not decode file {filepath} with cp1252.")
        return None
    except FileNotFoundError:
        print(f"Error: File not found at {filepath}")
        return None

    # Ensure necessary columns exist
    if 'name' not in df.columns or 'description' not in df.columns:
        print("Error: CSV must contain 'name' and 'description' columns.")
        return None

    # Fill NaN descriptions with empty string
    df['description'] = df['description'].fillna('')
    
    # Simple cleaning: remove newlines and extra spaces
    df['description'] = df['description'].str.replace(r'\s+', ' ', regex=True).str.strip()
    
    return df

def calculate_similarity(df):
    """Calculates cosine similarity matrix based on TF-IDF of descriptions."""
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['description'])
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    return cosine_sim

def build_graph(df, cosine_sim, threshold=0.2):
    """Builds a NetworkX graph where edges represent similarity > threshold."""
    G = nx.Graph()
    
    # Add nodes
    for idx, row in df.iterrows():
        G.add_node(idx, name=row['name'])
    
    # Add edges
    rows, cols = np.where(cosine_sim > threshold)
    for r, c in zip(rows, cols):
        if r < c: # Avoid duplicates and self-loops
            G.add_edge(r, c, weight=cosine_sim[r, c])
            
    return G

def draw_graph(G, df, output_file='club_relationship_graph.svg'):
    """Draws the graph and saves it to a file."""
    plt.figure(figsize=(15, 15)) # Increased size for better visibility
    
    # Position nodes using Fruchterman-Reingold force-directed algorithm
    # k controls the optimal distance between nodes. Smaller k = tighter clusters.
    pos = nx.spring_layout(G, k=0.15, iterations=50, weight='weight') 
    
    # Draw nodes
    nx.draw_networkx_nodes(G, pos, node_size=50, node_color='skyblue', alpha=0.8)
    
    # Draw edges with varying thickness based on weight
    edges = G.edges(data=True)
    weights = [d['weight'] * 2 for u, v, d in edges] # Scale weights for visibility
    nx.draw_networkx_edges(G, pos, width=weights, alpha=0.4, edge_color='gray')
    
    # Draw labels (optional, can be messy with many nodes)
    labels = {idx: name for idx, name in enumerate(df['name'])}
    nx.draw_networkx_labels(G, pos, labels, font_size=4)
    
    plt.title("Terrier Club Relationship Graph (Homophily)\nCloser nodes are generally more similar. Thicker edges = higher similarity.")
    plt.axis('off')
    plt.savefig(output_file, format='svg')
    print(f"Graph saved to {output_file}")
    plt.close()

def recommend_clubs(club_name, df, cosine_sim, top_n=5):
    """Recommends clubs similar to the given club name."""
    try:
        idx = df[df['name'] == club_name].index[0]
    except IndexError:
        print(f"Club '{club_name}' not found.")
        return

    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get top N similar clubs (excluding itself)
    sim_scores = sim_scores[1:top_n+1]
    
    print(f"\nRecommendations for '{club_name}':")
    for i, score in sim_scores:
        print(f"- {df.iloc[i]['name']} (Similarity: {score:.4f})")

def main():
    filepath = 'd:/TerrierClub/Graph/all_terrier_clubs.csv'
    df = load_and_process_data(filepath)
    
    if df is not None:
        print(f"Loaded {len(df)} clubs.")
        
        cosine_sim = calculate_similarity(df)
        print("Similarity matrix calculated.")
        
        # Adjust threshold as needed. Higher threshold = fewer edges, more distinct clusters.
        threshold = 0.15 
        G = build_graph(df, cosine_sim, threshold=threshold)
        print(f"Graph built with {G.number_of_nodes()} nodes and {G.number_of_edges()} edges.")
        
        draw_graph(G, df, output_file='d:/TerrierClub/Graph/club_graph.svg')
        
        # Example Recommendations
        # Pick a random club or a specific one if known
        if not df.empty:
            example_club = df.iloc[0]['name'] # First club
            recommend_clubs(example_club, df, cosine_sim)
            
            # Try another one if available
            if len(df) > 10:
                 example_club_2 = df.iloc[10]['name']
                 recommend_clubs(example_club_2, df, cosine_sim)

if __name__ == "__main__":
    main()
