import sys
from PIL import Image

def remove_white(in_path, out_path):
    img = Image.open(in_path).convert("RGBA")
    datas = img.getdata()
    newData = []
    for item in datas:
        # Check if the pixel is close to white
        if item[0] > 220 and item[1] > 220 and item[2] > 220:
            # Make it fully transparent
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    img.save(out_path, "PNG")

if __name__ == "__main__":
    remove_white(sys.argv[1], sys.argv[2])
