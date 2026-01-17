#!/usr/bin/env python3
import re

file_path = "src/pages/AdminBusinessOwnerDetail.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix invoiceStatus Select
content = re.sub(
    r'value=\{invoiceStatus\}',
    'value={invoiceStatus || "all"}',
    content
)
content = re.sub(
    r'setInvoiceStatus\(value\);\s+setCurrentPage\(1\);',
    'setInvoiceStatus(value === "all" ? "" : value);\n\t\t\t\t\t\t\t\t\tsetCurrentPage(1);',
    content
)

# Fix outputStatus Select
content = re.sub(
    r'value=\{outputStatus\}',
    'value={outputStatus || "all"}',
    content
)
content = re.sub(
    r'setOutputStatus\(value\);\s+setOutputCurrentPage\(1\);',
    'setOutputStatus(value === "all" ? "" : value);\n\t\t\t\t\t\t\t\t\tsetOutputCurrentPage(1);',
    content
)

# Fix storageCategory Select
content = re.sub(
    r'value=\{storageCategory\}',
    'value={storageCategory || "all"}',
    content
)
content = re.sub(
    r'setStorageCategory\(value\);\s+setStorageCurrentPage\(1\);',
    'setStorageCategory(value === "all" ? "" : value);\n\t\t\t\t\t\t\t\t\tsetStorageCurrentPage(1);',
    content
)

# Fix productCategory Select
content = re.sub(
    r'value=\{productCategory\}',
    'value={productCategory || "all"}',
    content
)
content = re.sub(
    r'setProductCategory\(value\);\s+setProductCurrentPage\(1\);',
    'setProductCategory(value === "all" ? "" : value);\n\t\t\t\t\t\t\t\t\tsetProductCurrentPage(1);',
    content
)

# Fix productIsActive Select
content = re.sub(
    r'value=\{productIsActive\}',
    'value={productIsActive || "all"}',
    content
)
content = re.sub(
    r'setProductIsActive\(value\);\s+setProductCurrentPage\(1\);',
    'setProductIsActive(value === "all" ? "" : value);\n\t\t\t\t\t\t\t\t\tsetProductCurrentPage(1);',
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("✅ Fixed all Select components!")
