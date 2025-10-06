#!/usr/bin/env python3
n=142859
e=65537
c=67090
# factor n by trial division
import math
for p in range(2,int(math.sqrt(n))+1):
    if n%p==0:
        q=n//p; break
phi=(p-1)*(q-1)
d=pow(e,-1,phi)
m=pow(c,d,n)
print('m=',m)
b = m.to_bytes((m.bit_length()+7)//8,'big')
print('plaintext=',b)
