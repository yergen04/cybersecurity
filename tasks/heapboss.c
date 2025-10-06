#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[32];
    void (*fn)();
} Boss;

void normal_greeting() {
    puts("Hello, boss! Nothing special here.");
}

void secret() {
    puts("\n🎉 Congratulations! You've exploited the heap!");
    puts("FLAG{heap_master}");
    exit(0);
}

int main() {
    Boss *boss = malloc(sizeof(Boss));
    char *buffer = malloc(32);

    boss->fn = normal_greeting;

    printf("=== HeapBoss Challenge ===\n");
    printf("Boss object at: %p\n", boss);
    printf("Buffer at: %p\n", buffer);
    printf("Secret function at: %p\n", secret);
    printf("\nEnter boss name: ");

    // VULNERABILITY: No bounds checking!
    gets(buffer);

    strcpy(boss->name, "The Boss");
    boss->fn();

    free(buffer);
    free(boss);
    return 0;
}

/*
Compile with:
gcc -o heapboss heapboss.c -fno-stack-protector -z execstack -no-pie

Hint: Overflow the buffer to overwrite boss->fn pointer to point to secret()
*/
