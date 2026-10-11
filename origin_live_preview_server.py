"""Local-only same-origin proxy for OriginDuty public feeds (developer preview)."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
import subprocess,os
os.chdir(Path(__file__).resolve().parent)
ROUTES={"/__origin_live_feed":"regulations.json","/__origin_source_status":"api/source-status"}
class Preview(SimpleHTTPRequestHandler):
 def do_GET(self):
  route=self.path.split("?")[0]
  if route not in ROUTES:return super().do_GET()
  try:
   url="https://public-pilot-production.up.railway.app/"+ROUTES[route]
   p=subprocess.run(["curl.exe","-fLsS","--max-time","15","--max-filesize","2000000",url],capture_output=True,timeout=18)
   if p.returncode!=0 or not p.stdout or len(p.stdout)>2_000_000:raise ValueError("Upstream unavailable")
   body=p.stdout
   self.send_response(200)
  except Exception:
   body=b'{"error":"upstream_unavailable"}'
   self.send_response(503)
  self.send_header("Content-Type","application/json; charset=utf-8")
  self.send_header("Cache-Control","no-store")
  self.send_header("Content-Length",str(len(body)))
  self.end_headers()
  self.wfile.write(body)
if __name__=="__main__":
 ThreadingHTTPServer(("127.0.0.1",18765),Preview).serve_forever()
