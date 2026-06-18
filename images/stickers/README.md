# ステッカー画像（ドロップイン）

このフォルダに **透過PNG** を所定のファイル名で置くと、HERO と WHY STASH の
該当ステッカーが **自動で実画像に差し替わります**（JSが読み込めた画像だけ適用、
無ければCSSのテキストステッカーのまま）。コード変更は不要です。

## 期待されるファイル名（すべて透過PNG）

| ファイル名 | ステッカー | 状態 |
|---|---|---|
| `dig-area.png` | DIG AREA | 未 |
| `hidden-gems.png` | HIDDEN GEMS | 未 |
| `find-your-vibe.png` | FIND YOUR VIBE | 未 |
| `good-things.png` | GOOD THINGS TAKE DIGGING | 未 |
| `have-a-good-dig.png` | HAVE A GOOD DIG!（円） | ✅ 収録済み |
| `someones-trash.png` | SOMEONE'S TRASH SOMEONE'S TREASURE | 未 |
| `energy.png` | ENERGY | 未 |
| `90s.png` | 90s | 未 |
| `hore.png` | 掘れ | 未 |

## 推奨スペック
- 背景**透過**（アルファ付きPNG）。不要部分は切り抜いておく。
- 長辺 **約 400–600px**（Web表示には十分・軽量）。
- できるだけ **余白を詰めて** トリミング（要素ぴったり）。

## きれいな切り抜きについて
確定フライヤー（`STASH_A_01_ol.pdf`）は1枚に焼き込まれ、ステッカー同士が
重なっているため、ここから全点をきれいに切り出すのは品質的に困難です。
**最も確実なのは、元データ（AI/PSD＝レイヤー分かれ）から各ステッカーを
個別に透過PNG書き出しすること**です（採択後共有予定のデータが最適）。

円形など独立したものは `tools/extract_stickers.py` で抜けます
（`have-a-good-dig.png` はこの方法で作成）。
