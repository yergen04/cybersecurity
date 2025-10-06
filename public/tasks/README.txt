
CTF task pack - generated files and quick run notes

Files created in this folder:
- beach.png                 : PNG with flag hidden in LSB of blue channel (task Hidden Pixels)
- app.py                   : Flask vulnerable app for Bakery SQL (task Bakery SQL)
- bakery.db                : SQLite DB with pastries and flags (contains FLAG{sql_in_my_cake})
- run_bakery.sh            : script to run the Flask app
- rsa.txt                  : RSA parameters (n, e, c) for Small RSA task
- rsa_decrypt.py           : script to decrypt rsa.txt by factoring n
- heapboss.c               : source for vulnerable binary
- heapboss                 : compiled vulnerable binary (no PIE)
- obfusvm                 : small VM interpreter (executable python script)
- program.bin             : bytecode input to obfusvm (produces encrypted flag which can be XOR-decrypted using key in mem[0:16])
- beach.png               : the stego image (again)
- rsa.txt                 : RSA params

Quick hints to solve / run:

1) Hidden Pixels:
   - Use the provided 'beach.png'. The flag is encoded in the LSB of the blue channel starting from the first pixel.
   - Example Python snippet:
     from PIL import Image
     im=Image.open('beach.png'); bits=[]
     for y in range(im.height):
       for x in range(im.width):
         r,g,b=im.getpixel((x,y)); bits.append(str(b&1))
     # join bits per 8 -> bytes -> decode and search for FLAG{}

2) Bakery SQL:
   - Run: python3 app.py  (or ./run_bakery.sh)
   - Search URL: http://127.0.0.1:5000/search?q=...
   - Exploit example:
     /search?q=%' UNION SELECT flag, 'x' FROM flags -- 
   - URL-encode payload when testing with browser.

3) Small RSA:
   - Open rsa.txt. Use rsa_decrypt.py to factor n and recover plaintext.
   - The ciphertext was generated without padding to keep factorization simple.

4) HeapBoss:
   - The binary is compiled with -no-pie so addresses are stable. The program has an overflow in edit allowing overwriting the stored function pointer `fn` for the item. Overwrite it with the address of `secret` to get the flag printed when `show` is invoked.
   - Typical exploit steps:
     * add item with size 32 -> index 0
     * edit index 0 with payload = b"A"*32 + <8-byte address of secret little-endian>
     * show index 0 -> should print data and call secret -> prints FLAG
   - You can find address of secret using 'nm heapboss' or 'objdump -d heapboss | grep secret'

5) ObfusVM:
   - Run the VM: ./obfusvm program.bin > out.enc
   - The VM writes key into mem[0:16], then writes encrypted flag into mem[16...]. The output is the encrypted bytes. To recover the flag, XOR the output bytes with the key (which is the first 16 bytes placed in mem). A simple script can emulate the VM or run it and then XOR.

Have fun solving!
