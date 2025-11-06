import qrcode, os, io

qr_temp_path= "uploads\qr.png"

def qr_generator(url_path: str):
    # Generating
    qr = qrcode.make(url_path)
    # Save it into memory (not disk)
    img_io = io.BytesIO()
    qr.save(img_io, 'PNG')
    img_io.seek(0)
    # Return Value
    return img_io

def removing_temp_qr():
    # Get Path  
    if os.path.exists(qr_temp_path):
        try:
            os.remove(qr_temp_path)
            return "File Removed Successfully!"
        except OSError as e:
            return f"Error Deleting {e}"
    else:
        return "File Doesnt Exist!"