import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt

def load_data(filepath):
    """Loads the keyword summary data."""
    try:
        # Try reading with default encoding first, then cp1252 if needed
        try:
            df = pd.read_csv(filepath)
        except UnicodeDecodeError:
            df = pd.read_csv(filepath, encoding='cp1252')
        return df
    except FileNotFoundError:
        print(f"Error: File not found at {filepath}")
        return None

def build_bipartite_graph(df):
    """Builds a bipartite graph from the dataframe."""
    B = nx.Graph()
    
    # Add nodes with the node attribute "bipartite"
    # We need to collect all keywords first or add them dynamically
    
    for idx, row in df.iterrows():
        club = row['Club Name']
        keywords_str = row['Keywords']
        
        if pd.isna(keywords_str):
            continue
            
        B.add_node(club, bipartite=0, color='blue') # Clubs
        
        # Split keywords by semicolon and strip whitespace
        keywords = [k.strip() for k in keywords_str.split(';') if k.strip()]
        
        for keyword in keywords:
            B.add_node(keyword, bipartite=1, color='red') # Keywords
            B.add_edge(club, keyword)
            
    return B

def draw_bipartite_graph(B, output_file='bipartite_graph_weighted_3.svg'):
    """Draws the bipartite graph and saves it to a file."""
    plt.figure(figsize=(20, 20))
    
    # Separate nodes by partition
    clubs = {n for n, d in B.nodes(data=True) if d['bipartite'] == 0}
    keywords = {n for n, d in B.nodes(data=True) if d['bipartite'] == 1}
    
    # Use a spring layout which often looks better for general structure
    pos = nx.spring_layout(B, k=0.5, iterations=200)
    
    # Draw Club nodes
    nx.draw_networkx_nodes(B, pos, nodelist=list(clubs), node_color='lightblue', node_size=50, alpha=0.6, label='Clubs')
    
    # Draw Keyword nodes
    nx.draw_networkx_nodes(B, pos, nodelist=list(keywords), node_color='salmon', node_size=300, alpha=0.9, label='Keywords')
    
    # Draw edges
    nx.draw_networkx_edges(B, pos, alpha=0.2, edge_color='gray')
    
    # Draw labels for Keywords only (to avoid clutter)
    nx.draw_networkx_labels(B, pos, labels={n: n for n in keywords}, font_size=8, font_weight='bold')
    
    # Optional: Draw labels for Clubs if not too many, or just a subset
    # nx.draw_networkx_labels(B, pos, labels={n: n for n in clubs}, font_size=6, alpha=0.5)
    
    plt.title("Club-Keyword Bipartite Graph")
    plt.legend()
    plt.axis('off')
    plt.savefig(output_file, format='svg')
    print(f"Graph saved to {output_file}")
    plt.close()

def main():
    filepath = 'd:/TerrierClub/Graph/terrier_clubs_keywords_weighted.csv'
    df = load_data(filepath)
    
    if df is not None:
        print(f"Loaded {len(df)} clubs.")
        
        B = build_bipartite_graph(df)
        print(f"Graph built with {B.number_of_nodes()} nodes and {B.number_of_edges()} edges.")
        
        draw_bipartite_graph(B, output_file='d:/TerrierClub/Graph/bipartite_graph_weighted_4.svg')

if __name__ == "__main__":
    main()
