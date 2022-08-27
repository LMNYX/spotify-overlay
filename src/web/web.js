import 'dotenv/config';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { PresetOutput } from 'utilities/output';
import path from 'path';
const fastify = Fastify({});

fastify.register(fastifyStatic, {
    root: path.join(__dirname, "..", "..", "static"),
    prefix: '/public/',
    list: {
        format: 'html',
        render: (dirs, files) => {
            return `
<html><body>
<h2>Overlays</h2>
<pre>To create your own navigate to ${path.join(__dirname, '..', '..', 'static', 'overlays')}</pre>
<ul>
  ${dirs.map(dir => `<li><a href="${dir.href}">${dir.name}</a></li>`).join('\n  ')}
</ul>
<ul>
  ${files.map(file => `<li><a href="${file.href}" target="_blank">${file.name}</a></li>`).join('\n  ')}
</ul>
</body></html>
`
        },
    },
    index: false
});

export default class Web
{
    constructor(port)
    {
        this.Output = new PresetOutput('web');
        this.IsReady = false;
        this.HasReturnedCode = false;
        Promise.all([this.listen(port)]);
    }
    async listen (port)
    {
        try
        {
            fastify._this = this;
            fastify.get('/authorization', this.AuthorizationRoute);
            await fastify.listen({ port: port });
            this.Output.Log("Listening on port", port);
            this.IsReady = true;
        } catch (e) { this.listen(port); }
    }

    async AuthorizationRoute(request, reply)
    {
        this._this.CodeReturned = request.query.code;
        this._this.HasReturnedCode = true;
        
        reply.redirect("/public/overlays");
    }
}