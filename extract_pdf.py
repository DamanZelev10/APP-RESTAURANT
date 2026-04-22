import fitz # PyMuPDF
import os

pdf_path = "Imagenes rose.pdf"
output_dir = "public/gallery_extracted"
os.makedirs(output_dir, exist_ok=True)

# Generate HTML file to view them later
html_content = "<html><body style='display:flex; flex-wrap:wrap; gap:10px;'>"

try:
    doc = fitz.open(pdf_path)
    count = 1
    for page_index in range(len(doc)):
        page = doc[page_index]
        image_list = page.get_images()
        for image_index, img in enumerate(image_list, start=1):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            image_name = f"img_{count}.{image_ext}"
            
            with open(os.path.join(output_dir, image_name), "wb") as f:
                f.write(image_bytes)
                
            html_content += f"<div><img src='{image_name}' width='300' /><p>{image_name}</p></div>"
            print(f"Extracted {image_name}")
            count += 1
            
    html_content += "</body></html>"
    with open(os.path.join(output_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_content)
        
    print(f"Done. Extracted {count-1} images.")
    
except Exception as e:
    print(f"Error: {e}")
