# SubRecon Pro - Guia de Contribuição

## 🤝 Como Contribuir

Obrigado por considerar contribuir para o SubRecon Pro! Valorizamos todas as contribuições, desde correções de bugs até novas funcionalidades.

### Tipos de Contribuição

- 🐛 **Bug Reports** - Relatórios de problemas encontrados
- ✨ **Features** - Novas funcionalidades
- 📝 **Documentation** - Melhorias na documentação
- ♻️ **Refactoring** - Melhorias no código existente
- ⚡ **Performance** - Otimizações

### Processo de Contribuição

1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/seu-usuario/Subdom-nios.git`
3. **Crie uma branch**: `git checkout -b feature/sua-feature`
4. **Faça seus commits**: `git commit -m 'Adicione sua mensagem'`
5. **Push para a branch**: `git push origin feature/sua-feature`
6. **Abra um Pull Request**

### Padrões de Código

#### JavaScript/Node.js
```javascript
// Use arrow functions
const handleClick = () => {
  // código
};

// Procure manter funções pequenas e específicas
// Use nomes descritivos
```

#### React/Front-end
```javascript
// Components como funções
export default function ComponentName() {
  const [state, setState] = useState(initial);
  
  return (
    <div>Conteúdo</div>
  );
}
```

### Commit Messages

Siga o padrão Conventional Commits:

```
feat: Adicione nova funcionalidade
fix: Corrija um bug
docs: Atualize documentação
style: Mude formatação
refactor: Refatore código sem alterar funcionalidade
test: Adicione testes
chore: Atualize dependências
```

### Pull Request

Ao abrir um PR, inclua:

- [ ] Descrição clara do que foi feito
- [ ] Referência para issues relacionadas (#123)
- [ ] Screenshots (se aplicável)
- [ ] Testes (se aplicável)

---

**Obrigado por contribuir! 🎉**
