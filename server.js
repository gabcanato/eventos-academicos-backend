const express = require("express");
const cors = require("cors");
const supabase = require("./supabase");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;


//GET

app.get("/eventos", async (req, res) => {

    const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error(error);

        return res.status(500).json({
            erro: "Erro ao listar eventos."
        });
    }

    return res.status(200).json(data);
});


// POST

app.post("/eventos", async (req, res) => {

    const { titulo, descricao, data_evento, local } = req.body;

    if (
        typeof titulo !== "string" ||
        !titulo.trim() ||
        titulo.length > 150 ||
        typeof local !== "string" ||
        !local.trim() ||
        local.length > 100 ||
        typeof data_evento !== "string" ||
        !/^\d{2}\/\d{2}\/\d{4}$/.test(data_evento) ||
        (descricao != null && typeof descricao !== "string")
    ) {
        return res.status(400).json({
            erro: "Preencha os campos corretamente."
        });
    }

    const { data, error } = await supabase
        .from("eventos")
        .insert({
            titulo: titulo.trim(),
            descricao: descricao || "",
            data_evento: data_evento,
            local: local.trim()
        })
        .select()
        .single();

    if (error) {
        console.error(error);

        return res.status(500).json({
            erro: "Erro ao cadastrar evento."
        });
    }

    return res.status(201).json(data);
});


// INICIAR SERVIDOR

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});