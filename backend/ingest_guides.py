#!/usr/bin/env python3
"""
Utility script to ingest travel guide PDFs into ChromaDB.
Usage:
    python ingest_guides.py --file /path/to/guide.pdf --city "Paris" --category cultural

Or ingest all PDFs from a folder:
    python ingest_guides.py --folder ./guides --city "Paris"
"""

import os
import argparse
import sys
from rag_pipeline import TravelRAGPipeline


def main():
    parser = argparse.ArgumentParser(description="Ingest travel guide PDFs into ChromaDB")
    parser.add_argument("--file", help="Path to a single PDF file")
    parser.add_argument("--folder", help="Path to a folder containing PDFs")
    parser.add_argument("--city", required=True, help="City name (e.g. 'Paris')")
    parser.add_argument("--category", default="general", help="Category (e.g. cultural, food, adventure)")
    args = parser.parse_args()

    if not args.file and not args.folder:
        print("❌ Please provide either --file or --folder")
        sys.exit(1)

    print("🚀 Initializing RAG pipeline...")
    pipeline = TravelRAGPipeline()

    files_to_ingest = []

    if args.file:
        args.file = os.path.expanduser(args.file)
        if not os.path.exists(args.file):
            print(f"❌ File not found: {args.file}")
            sys.exit(1)
        files_to_ingest.append(args.file)

    if args.folder:
        args.folder = os.path.expanduser(args.folder)
        if not os.path.isdir(args.folder):
            print(f"❌ Folder not found: {args.folder}")
            sys.exit(1)
        for fname in os.listdir(args.folder):
            if fname.lower().endswith(".pdf"):
                files_to_ingest.append(os.path.join(args.folder, fname))

    if not files_to_ingest:
        print("⚠️  No PDF files found to ingest.")
        sys.exit(0)

    total_chunks = 0
    for fpath in files_to_ingest:
        print(f"\n📄 Ingesting: {os.path.basename(fpath)}")
        try:
            count = pipeline.ingest_pdf(fpath, args.city, args.category)
            total_chunks += count
            print(f"   ✅ Ingested {count} chunks")
        except Exception as e:
            print(f"   ❌ Error ingesting {fpath}: {e}")

    print(f"\n🎉 Done! Total chunks indexed: {total_chunks} for city='{args.city}'")


if __name__ == "__main__":
    main()
