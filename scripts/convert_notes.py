import os
import re
from jinja2 import Template

def extract_metadata(content):
    """Extract metadata from LaTeX file."""
    metadata = {}
    for line in content.split('\n'):
        if line.startswith('%'):
            match = re.match(r'% (\w+): (.+)', line)
            if match:
                key, value = match.groups()
                metadata[key.lower()] = value
    return metadata

def convert_latex_to_html(latex_content):
    """Convert basic LaTeX content to HTML."""
    # Remove metadata lines
    content = '\n'.join(line for line in latex_content.split('\n') if not line.startswith('%'))
    
    # Convert sections
    content = re.sub(r'\\section{(.*?)}', r'<h2>\1</h2>', content)
    content = re.sub(r'\\subsection{(.*?)}', r'<h3>\1</h3>', content)
    
    # Convert itemize environments
    content = re.sub(r'\\begin{itemize}(.*?)\\end{itemize}', 
                    lambda m: '<ul>' + m.group(1).replace('\\item', '<li>') + '</ul>', 
                    content, flags=re.DOTALL)
    
    # Convert enumerate environments
    content = re.sub(r'\\begin{enumerate}(.*?)\\end{enumerate}', 
                    lambda m: '<ol>' + m.group(1).replace('\\item', '<li>') + '</ol>', 
                    content, flags=re.DOTALL)
    
    # Convert math environments
    content = re.sub(r'\\begin{equation}(.*?)\\end{equation}', 
                    r'$$\1$$', 
                    content, flags=re.DOTALL)
    content = re.sub(r'\\begin{align}(.*?)\\end{align}', 
                    r'$$\1$$', 
                    content, flags=re.DOTALL)
    
    # Convert inline math
    content = re.sub(r'\$(.+?)\$', r'$\1$', content)
    
    # Convert basic formatting
    content = re.sub(r'\\textbf{(.*?)}', r'<strong>\1</strong>', content)
    content = re.sub(r'\\textit{(.*?)}', r'<em>\1</em>', content)
    
    # Convert paragraphs
    content = re.sub(r'\n\n+', '</p><p>', content)
    content = '<p>' + content + '</p>'
    
    # Clean up
    content = content.replace('\\\\', '<br>')
    content = re.sub(r'\s+', ' ', content)
    content = re.sub(r'<p>\s*</p>', '', content)
    
    return content

def process_note(note_dir):
    """Process a note directory containing content.tex."""
    # Read the LaTeX content
    with open(os.path.join(note_dir, 'content.tex'), 'r', encoding='utf-8') as f:
        latex_content = f.read()
    
    # Extract metadata
    metadata = extract_metadata(latex_content)
    
    # Convert LaTeX to HTML
    html_content = convert_latex_to_html(latex_content)
    
    # Read the template
    with open('notes/templates/note-template.html', 'r', encoding='utf-8') as f:
        template_content = f.read()
    
    # Create the HTML file
    template = Template(template_content)
    html_output = template.render(
        title=metadata.get('title', 'Untitled'),
        date=metadata.get('date', ''),
        subject=metadata.get('subject', ''),
        content=html_content
    )
    
    # Write the output
    output_file = os.path.join(note_dir, 'index.html')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_output)

def main():
    # Process all note directories
    notes_dir = 'notes'
    for item in os.listdir(notes_dir):
        item_path = os.path.join(notes_dir, item)
        if os.path.isdir(item_path) and os.path.exists(os.path.join(item_path, 'content.tex')):
            print(f"Processing {item}...")
            process_note(item_path)
            print(f"Finished processing {item}")

if __name__ == '__main__':
    main() 