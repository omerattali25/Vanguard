#!/usr/bin/env node

/**
 * Run via: pnpm proto:generate
*/

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "src");
const protocPath = path.join(
  root,
  "node_modules",
  ".bin",
  "grpc_tools_node_protoc"
);
const tsProtoPlugin = path.join(
  root,
  "node_modules",
  ".bin",
  "protoc-gen-ts_proto"
);

function findProtoFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findProtoFiles(fullPath));
    } else if (entry.name.endsWith(".proto")) {
      results.push(fullPath);
    }
  }
  return results;
}

const protoFiles = findProtoFiles(srcDir);

if (protoFiles.length === 0) {
  console.log("No .proto files found in src/");
  process.exit(0);
}

console.log(`Found ${protoFiles.length} .proto file(s):`);
protoFiles.forEach((f) => console.log(`  - ${path.relative(root, f)}`));

// Options that make ts-proto output NestJS-compatible types:
// - nestJs=true         → generates @GrpcMethod decorators and Controller interfaces
// - addGrpcMetadata=true → adds optional Metadata param to service methods
// - outputEncodeMethods=false → skip encode/decode (not needed for NestJS gRPC)
// - outputJsonMethods=false  → skip toJSON/fromJSON
// - outputClientImpl=false   → skip concrete client class (NestJS uses ClientGrpc proxy)
const tsProtoOptions = [
  "nestJs=true",
  "addGrpcMetadata=true",
  "outputEncodeMethods=false",
  "outputJsonMethods=false",
  "outputClientImpl=false",
].join(",");

for (const protoFile of protoFiles) {
  const cmd = [
    protocPath,
    `--plugin=protoc-gen-ts_proto=${tsProtoPlugin}`,
    // Output to src/ so generated files land next to .proto files
    `--ts_proto_out=${srcDir}`,
    `--ts_proto_opt=${tsProtoOptions}`,
    // Use src/ as proto_path so import paths are relative to src/
    `--proto_path=${srcDir}`,
    protoFile,
  ].join(" ");

  console.log(`\nGenerating: ${path.relative(root, protoFile)}`);
  try {
    execSync(cmd, { stdio: "inherit" });
    console.log(`  ✓ Done`);
  } catch (err) {
    console.error(`  ✗ Failed to generate from ${protoFile}`);
    process.exit(1);
  }
}

console.log("\n✓ All proto files generated successfully.");
