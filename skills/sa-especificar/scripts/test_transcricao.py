"""Checagem do transcricao.py: uv run --no-project python -m unittest test_transcricao (nesta pasta)."""
import hashlib
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from transcricao import converter, main  # noqa: E402

# fixtures sintéticas: nomes e falas inventados
VTT = """WEBVTT

NOTE gerado pela ferramenta de reunião

1
00:00:05.120 --> 00:00:08.000
<v Ana Souza>Bom dia a todos.</v>

2
00:00:08.500 --> 00:00:10.000
<v Ana Souza>Vamos falar do bloqueio.</v>

3
00:01:02.000 --> 00:01:05.000
<v Bruno Lima>Três tentativas bastam?</v>

01:02:03.000 --> 01:02:04.000
<v.loud Ana Souza>Sim, <b>três</b>.</v>
"""

# arquivo sem <v>: o falante vem do prefixo "Nome: "
VTT_PREFIXO = """WEBVTT

00:00:05.120 --> 00:00:08.000
Ana Souza: Bom dia a todos.
Vamos falar do bloqueio.

00:01:02.000 --> 00:01:05.000
Bruno Lima: Três tentativas bastam?

01:02:03.000 --> 01:02:04.000
Ana Souza: Sim, três.
"""

# com <v> no arquivo, "Atenção: " é fala sem falante; cue com duas vozes vira duas falas
VTT_VOZES = """WEBVTT

00:00:04.000 --> 00:00:06.000
<v Ana Souza>Primeira</v> <v Bruno Lima>Segunda</v>

00:00:07.000 --> 00:00:09.000
Atenção: isso é importante.
"""

MD = """# Reunião de alinhamento

**Ana Souza**   0:05
Bom dia a todos.
Vamos falar do bloqueio.

Bruno Lima   00:01:02
Três tentativas bastam?
Volto a falar disso
às 14:00

[01:02:03] Ana Souza: Sim, três.
"""


class Transcricao(unittest.TestCase):
    def arquivo(self, nome, texto):
        d = tempfile.mkdtemp()
        p = Path(d, nome)
        p.write_text(texto, encoding="utf-8")
        return p

    def test_vtt_e_md_dao_as_mesmas_falas(self):
        esperado = ["[00:05] P.O.: Bom dia a todos. Vamos falar do bloqueio.",
                    "[01:02] Bruno Lima: Três tentativas bastam?",
                    "[62:03] P.O.: Sim, três."]
        md = esperado[:1] + ["[01:02] Bruno Lima: Três tentativas bastam? Volto a falar disso às 14:00"] + esperado[2:]
        for nome, texto, saida in (("r.vtt", VTT, esperado), ("p.vtt", VTT_PREFIXO, esperado), ("r.md", MD, md)):
            p = self.arquivo(nome, texto)
            linhas, sem, sem_falante = converter(p, {"Ana Souza": "P.O."})
            self.assertEqual(linhas[2:], saida, nome)
            self.assertEqual((sem, sem_falante), (["Bruno Lima"], 0), nome)
            self.assertIn(hashlib.sha256(p.read_bytes()).hexdigest(), linhas[0])
            self.assertIn(nome, linhas[0])

    def test_vtt_divide_as_vozes_e_nao_inventa_falante(self):
        linhas, sem, sem_falante = converter(self.arquivo("v.vtt", VTT_VOZES))
        self.assertEqual(linhas[2:], ["[00:04] Ana Souza: Primeira", "[00:04] Bruno Lima: Segunda",
                                      "[00:07] ?: Atenção: isso é importante."])
        self.assertEqual((sem, sem_falante), (["Ana Souza", "Bruno Lima"], 1))

    def test_main_grava_ao_lado_e_recusa_o_que_nao_e_transcricao(self):
        p = self.arquivo("r.vtt", VTT)
        self.assertEqual(main([str(p), "--papel", "Ana Souza=P.O.", "--papel", "Bruno Lima=cliente"]), 0)
        saida = p.with_name("r.vtt.transcricao.md").read_text(encoding="utf-8")
        self.assertIn("[01:02] cliente: Três tentativas bastam?", saida)
        self.assertEqual(main([str(self.arquivo("vazio.md", "# só título\n"))]), 1)
        cp1252 = p.with_name("cp.md")
        cp1252.write_bytes("[00:01] Ana Souza: atenção".encode("cp1252"))
        for args in ([str(p.with_name("r.vtt.transcricao.md"))], [str(self.arquivo("r.docx", "x"))],
                     [str(p), "--papel", "sem-igual"], [str(p.with_name("nao-existe.vtt"))], [str(cp1252)]):
            with self.assertRaises(SystemExit) as erro:
                main(args)
            self.assertEqual(erro.exception.code, 2, args)


if __name__ == "__main__":
    unittest.main()
