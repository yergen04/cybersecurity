#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define STACK_SIZE 256

typedef struct {
    unsigned char stack[STACK_SIZE];
    int sp;
} VM;

void vm_init(VM *vm) {
    vm->sp = 0;
    memset(vm->stack, 0, STACK_SIZE);
}

void vm_push(VM *vm, unsigned char value) {
    if (vm->sp < STACK_SIZE) {
        vm->stack[vm->sp++] = value;
    }
}

unsigned char vm_pop(VM *vm) {
    if (vm->sp > 0) {
        return vm->stack[--vm->sp];
    }
    return 0;
}

void vm_execute(VM *vm, const char *filename) {
    FILE *f = fopen(filename, "r");
    if (!f) {
        printf("Cannot open %s\n", filename);
        return;
    }

    char line[64];
    while (fgets(line, sizeof(line), f)) {
        if (strncmp(line, "PUSH", 4) == 0) {
            unsigned int val;
            sscanf(line + 5, "%x", &val);
            vm_push(vm, (unsigned char)val);
        } else if (strncmp(line, "PRINT", 5) == 0) {
            printf("Output: ");
            for (int i = vm->sp - 1; i >= 0; i--) {
                printf("%c", vm->stack[i]);
            }
            printf("\n");
        }
    }
    fclose(f);
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: %s <program.bin>\n", argv[0]);
        return 1;
    }

    VM vm;
    vm_init(&vm);

    printf("ObfusVM - Challenge VM\n");
    printf("======================\n\n");

    vm_execute(&vm, argv[1]);

    return 0;
}
